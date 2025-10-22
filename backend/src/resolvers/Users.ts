import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User, UserCreateInput, UserUpdateInput } from "../entities/User";
import { validate } from "class-validator";
import argon2 from "argon2";
import { sign } from "jsonwebtoken";
import Cookies from "cookies";
import { ContextType } from "../auth";
import { ensureLambdaUser } from "../utils/ensureLambdaUserAfterDeleted";
import { PassengerRide, PassengerRideStatus } from "../entities/PassengerRide";
import { Ride } from "../entities/Ride";
import { GraphQLError } from "graphql";
import { verify } from "jsonwebtoken";
import { verifyUserEmail } from "../mail/verifyEmail";
import { VerifyEmailResponse } from "../types/VerifyEmailResponse";

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

  @Mutation(() => User, { nullable: true })
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() context: ContextType
  ): Promise<User | null> {
    try {
      const user = await User.findOneBy({ email });
      if (user) {
        if (!user.isVerified) {
          throw new Error("Unverified Email");
        }
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
      throw e;
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
      // Checks if a user with this email already exists
      const existingUser = await User.findOneBy({ email: data.email });

      if (existingUser) {
        // if user email exists but not verified
        if (!existingUser.isVerified) {
          // calculate how long ago his account was created
          const createdAt = existingUser.createdAt.getTime();
          const now = Date.now();
          const delay = now - createdAt;
          const oneDay = 24 * 60 * 60 * 1000; // 24h

          if (delay > oneDay) {
            // if unverified account expired : GDPR-friendly deletion
            await existingUser.remove();
          } else {
            // if account not expired
            throw new Error("account not expired");
          }
        } else {
          // account already verified
          throw new Error("account already verified");
        }
      }

      const hashedPassword = await argon2.hash(data.password);
      Object.assign(newUser, data, { hashedPassword, password: undefined });
      await newUser.save();

      // create a temporary JWT with user id
      const token = sign(
        {
          id: newUser.id,
          role: newUser.role,
        },
        process.env.JWT_VERIFY_SECRET || "",
        { expiresIn: "24h" }
      );

      // send email to user with verification link
      await verifyUserEmail(newUser, token);

      return newUser;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("unable to create user");
    }
  }

  @Mutation(() => VerifyEmailResponse)
  async verifyEmail(@Arg("token") token: string): Promise<VerifyEmailResponse> {
    try {
      const decoded = verify(token, process.env.JWT_VERIFY_SECRET || "") as unknown as {
        userId: number;
      };

      const user = await User.findOne({ where: { id: decoded.userId } });

      if (!user) throw new Error("User not found");
      if (user.isVerified) return { success: true, message: "Already verified" };

      user.isVerified = true;
      await user.save();

      return { success: true, message: "Email verified successfully!" };
    } catch (error) {
      console.error("Verification error :", error);
      throw new Error("Invalid or expired verification link");
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

    // 1) If requesting a password change: require and verify currentPassword
    if (data.password) {
      if (!data.currentPassword) {
        throw new GraphQLError("Current password is required.", {
          extensions: { code: "BAD_USER_INPUT", field: "currentPassword" },
        });
      }
      const ok = await argon2.verify(user.hashedPassword, data.currentPassword);
      if (!ok) {
        throw new GraphQLError("Current password is invalid.", {
          extensions: { code: "BAD_USER_INPUT", field: "currentPassword" },
        });
      }
      // 2) Hash the new password
      user.hashedPassword = await argon2.hash(data.password);
    }

    // 3) Never persist these raw fields
    delete (data as UserUpdateInput).password;
    delete (data as UserUpdateInput).currentPassword;

    // 4) Apply the rest (email/firstname/lastname) and validate the entity
    Object.assign(user, data);

    const errors = await validate(user);
    if (errors.length > 0) {
      throw new GraphQLError("Invalid data.", { extensions: { code: "BAD_USER_INPUT" } });
    }

    try {
      await user.save();
    } catch (e: any) {
      if (e.code === "23505") {
        throw new GraphQLError("This email is already in use.", {
          extensions: { code: "BAD_USER_INPUT", field: "email" },
        });
      }
      throw e;
    }

    return user;
  }

  @Authorized("user")
  @Mutation(() => Boolean)
  async deleteMyAccount(
    @Ctx() context: ContextType,
    @Arg("currentPassword") currentPassword: string
  ): Promise<boolean> {
    const me = context.user;
    if (!me) return false;

    const userForCheck = await User.findOneBy({ id: me.id });
    if (!userForCheck) return false;

    const ok = await argon2.verify(userForCheck.hashedPassword, currentPassword);
    if (!ok) {
      throw new GraphQLError("Invalid current password.", {
        extensions: { code: "BAD_USER_INPUT", field: "currentPassword" },
      });
    }

    try {
      const lambda = await ensureLambdaUser(); // util that creates/returns a "deleted" user

      await User.getRepository().manager.transaction(async (m) => {
        // 1) Load the current user
        const user = await m.findOne(User, { where: { id: me.id } });
        if (!user) return;

        // ========= A) PASSENGER: cancel + decrement if APPROVED, then reassign to lambda
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

        // ========= B) DRIVER: Mark trips and passengers, reassign driver_id
        const driverRideRows: { id: number }[] = await m.query(
          `SELECT id FROM "ride" WHERE driver_id = $1`,
          [user.id]
        );
        const driverRideIds = driverRideRows.map((r) => r.id);

        if (driverRideIds.length) {
          // Passengers on these trips → CANCELLED_BY_DRIVER
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

          // Reassign the driver to lambda user
          await m.query(`UPDATE "ride" SET driver_id = $1 WHERE id = ANY($2::int[])`, [
            lambda.id,
            driverRideIds,
          ]);
        }

        // ========= C) Delete real user
        await m.delete(User, { id: user.id });
      });

      // D) Logout (same logic as signout)
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

  // No decorator here, it's intentional
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
