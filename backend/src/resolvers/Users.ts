import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { User, UserCreateInput, UserUpdateInput } from "../entities/User";
import { validate } from "class-validator";
import argon2 from "argon2";
import { sign } from "jsonwebtoken";
import Cookies from "cookies";
import { ContextType } from "../auth";
import { ensureLambdaUser } from "../utils/ensureLambdaUserAfterDeleted";
import { PassengerRide, PassengerRideStatus } from "../entities/PassengerRide";
import { Ride } from "../entities/Ride";

@Resolver()
export class UsersResolver {
  @Authorized("admin")
  @Query(() => [User])
  async users(): Promise<User[] | null> {
    const users = await User.find();
    if (users !== null) {
      return users;
    } else {
      return null;
    }
  }

  // @Authorized()
  // @Query(() => User)
  // async user(
  //   @Arg("id", () => ID) id: number,
  //   @Ctx() context: ContextType
  // ): Promise<User | null> {
  //   const user = await User.findOneBy({ id: context.user?.id });
  //   if (user) {
  //     return user;
  //   } else {
  //     return null;
  //   }
  // }

  @Mutation(() => User, { nullable: true })
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() context: ContextType
  ): Promise<User | null> {
    try {
      const user = await User.findOneBy({ email });
      if (user) {
        if (await argon2.verify(user.hashedPassword, password)) {
          const token = sign(
            {
              id: user.id,
              role: user.role,
            },
            process.env.JWT_SECRET_KEY || ""
          );

          const cookies = new Cookies(context.req, context.res, {
            secure: process.env.NODE_ENV === "production",
          });

          cookies.set("token", token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 72, // 72 hours
          });

          return user;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  @Mutation(() => User)
  async createUser(@Arg("data", () => UserCreateInput) data: UserCreateInput): Promise<User> {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }
    const newUser = new User();
    try {
      const hashedPassword = await argon2.hash(data.password);
      Object.assign(newUser, data, { hashedPassword, password: undefined });
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error(error);
      throw new Error("unable to create user");
    }
  }

  @Authorized("user")
  @Mutation(() => User, { nullable: true })
  async updateMyAccount(
    @Ctx() context: ContextType,
    @Arg("data", () => UserUpdateInput) data: UserUpdateInput
  ): Promise<User | null> {
    const me = context.user;
    if (!me) return null;

    const user = await User.findOneBy({ id: me.id });
    if (!user) return null;

    // Hash si password fourni
    if (data.password) {
      const hashedPassword = await argon2.hash(data.password);
      // on ne persiste jamais le champ 'password' brut
      delete data.password;
      (data as any).hashedPassword = hashedPassword;
    }

    Object.assign(user, data);

    // validation (email sur l'entité)
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

    try {
      await user.save();
    } catch (e: any) {
      // gestion email unique (citext UNIQUE)
      if (e.code === "23505") {
        throw new Error("This email is already used.");
      }
      throw e;
    }

    return user;
  }

  @Authorized("user")
  @Mutation(() => Boolean)
  async deleteMyAccount(@Ctx() context: ContextType): Promise<boolean> {
    const me = context.user;
    if (!me) return false;

    try {
      const lambda = await ensureLambdaUser(); // util qui crée/retourne un user "deleted"

      await User.getRepository().manager.transaction(async (m) => {
        // 1) Charger l'utilisateur courant
        const user = await m.findOne(User, { where: { id: me.id } });
        if (!user) return;

        // ========= A) PASSAGER : annuler + décrémenter si APPROVED, puis réassigner au lambda
        const prs = await m.find(PassengerRide, {
          where: { user_id: user.id },
          relations: { ride: true },
        });

        const ridesToDecrement = prs
          .filter((pr) => pr.status === PassengerRideStatus.APPROVED && pr.ride)
          .map((pr) => pr.ride!.id);

        if (ridesToDecrement.length) {
          await m.query(
            `UPDATE "ride"
            SET nb_passenger = GREATEST(0, nb_passenger - 1)
            WHERE id = ANY($1::int[])`,
            [ridesToDecrement]
          );
        }

        await m
          .createQueryBuilder()
          .update(PassengerRide)
          .set({
            status: PassengerRideStatus.CANCELLED_BY_PASSENGER,
            user_id: lambda.id,
          })
          .where("user_id = :uid", { uid: user.id })
          .execute();

        // ========= B) CONDUCTEUR : marquer les trajets et passagers, réassigner driver_id
        const driverRideRows: { id: number }[] = await m.query(
          `SELECT id FROM "ride" WHERE driver_id = $1`,
          [user.id]
        );
        const driverRideIds = driverRideRows.map((r) => r.id);

        if (driverRideIds.length) {
          // Passagers de ces trajets → CANCELLED_BY_DRIVER
          await m
            .createQueryBuilder()
            .update(PassengerRide)
            .set({ status: PassengerRideStatus.CANCELLED_BY_DRIVER })
            .where("ride_id IN (:...rids)", { rids: driverRideIds })
            .andWhere("status IN (:...st)", {
              st: [PassengerRideStatus.WAITING, PassengerRideStatus.APPROVED],
            })
            .execute();

          // Trajets → annulés
          await m
            .createQueryBuilder()
            .update(Ride)
            .set({ is_cancelled: true })
            .where("id IN (:...rids)", { rids: driverRideIds })
            .execute();

          // Réassigner le driver **via la FK** (relation non gérée par .set)
          await m.query(
            `UPDATE "ride" SET driver_id = $1 WHERE id = ANY($2::int[])`,
            [lambda.id, driverRideIds]
          );
        }

        // ========= C) Supprimer l'utilisateur réel
        await m.delete(User, { id: user.id });
      });

      // D) Logout (même logique que signout)
      const cookies = new Cookies(context.req, context.res, {
        secure: process.env.NODE_ENV === "production",
      });
      cookies.set("token", "", {
        maxAge: 0,
        sameSite: "strict",
        httpOnly: true,
      });

      return true;
    } catch (e) {
      console.error("deleteMyAccount failed:", e);
      return false;
    }
  }

  // Pas de décorateur ici, c'est intentionnel
  @Query(() => User, { nullable: true })
  async whoami(@Ctx() context: ContextType): Promise<User | null> {
    // return getUserFromContext(context);
    return context.user ?? null;
  }

  @Authorized("user")
  @Mutation(() => Boolean)
  async signout(@Ctx() context: ContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", { maxAge: 0 });
    return true;
  }
}
