import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Info,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { User, UserCreateInput, UserUpdateInput } from "../entities/User";
import { validate } from "class-validator";
import argon2 from "argon2";
import { decode, sign, verify } from "jsonwebtoken";
import Cookies from "cookies";
import { ContextType, getUserFromContext } from "../auth";

@Resolver()
export class UsersResolver {
  @Authorized()
  @Query(() => [User])
  async users(@Ctx() context: ContextType): Promise<User[] | null> {
    const users = await User.find();
    if (users !== null) {
      return users;
    } else {
      return null;
    }
  }

  @Authorized()
  @Query(() => User)
  async user(
    @Arg("id", () => ID) id: number,
    @Ctx() context: ContextType
  ): Promise<User | null> {
    const user = await User.findOneBy({ id: context.user?.id });
    if (user) {
      return user;
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
        if (await argon2.verify(user.hashedPassword, password)) {
          const token = sign(
            {
              id: user.id,
              role: user.role,
            },
            process.env.JWT_SECRET_KEY || ""
          );
          // try {
          //     verify(token, process.env.JWT_SECRET_KEY);
          //     console.log("token verified");
          // }
          // catch (error) {
          //     console.error("Error verifying token:", error);
          // }

          const cookies = new Cookies(context.req, context.res);

          cookies.set("token", token, {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 72, // 72 hours
          });
          console.log("cookies", cookies.get("token"));

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
  async createUser(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
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

  // @Mutation(() => User, { nullable: true })
  // async updateUser(
  //     @Arg("id", () => ID) id: number,
  //     @Arg("data", () => UserUpdateInput) data: UserUpdateInput
  // ): Promise<User | null> {
  //     const user = await User.findOneBy({ id });
  //     if (user !== null) {

  //         await user.save();
  //         return user;
  //     } else {
  //         return null;
  //     }
  // }

  @Mutation(() => User, { nullable: true })
  async deleteUser(@Arg("id", () => ID) id: number): Promise<User | null> {
    const user = await User.findOneBy({ id });
    if (user !== null) {
      await user.remove();
      Object.assign(user, { id });
      return user;
    } else {
      return null;
    }
  }

  // @Authorized()
  @Query(() => User, { nullable: true })
  async whoami(@Ctx() context: ContextType): Promise<User | null> {
    return getUserFromContext(context);
  }

  @Mutation(() => Boolean)
  async signout(@Ctx() context: ContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", { maxAge: 0 });
    return true;
  }
}
