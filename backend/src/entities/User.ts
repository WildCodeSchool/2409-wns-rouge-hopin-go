import { IsEmail, Matches, MaxLength, MinLength } from "class-validator";
import {
  Field,
  ID,
  InputType,
  MiddlewareFn,
  ObjectType,
  UseMiddleware,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContextType } from "../auth";

export const IsUser: MiddlewareFn<ContextType> = async (
  { context, root },
  next
) => {
  if (context.user) {
    if (context.user.role === "admin" || context.user.id === root.id) {
      //si je suis admin ou si je suis le user il faut que le user connecté soit le même que le user requêté
      return await next(); // dans ce cas on poursuit le traitement
    } else {
      return null; // sinon on arrête tout et on renvoie null
    }
  }
};

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ unique: true })
  @IsEmail({}, { message: "Invalid email" })
  @Field({ nullable: true }) // this should be nullable because only admins + self user may see this, null otherwise
  @UseMiddleware(IsUser)
  email!: string;

  @Column({ enum: ["user", "admin"], default: "user" })
  @Field()
  role!: string;

  @Column()
  // @Field()
  hashedPassword!: string;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  // may be needed if user can create other users
  // @ManyToOne(() => User)
  // @Field(() => User)
  // createdBy!: User;
}

@InputType()
export class UserCreateInput {
  @IsEmail({}, { message: "Invalid email" })
  @Field()
  email!: string;

  @Field()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(32, { message: "Password cannot exceed 32 characters" })
  @Matches(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/\d/, { message: "Password must contain at least one number" })
  @Matches(/[@$!%*?&]/, {
    message: "Password must contain at least one special character (@$!%*?&)",
  })
  password!: string;
}

@InputType()
export class UserUpdateInput {
  @IsEmail({}, { message: "Invalid email" })
  @Field()
  email!: string;

  @Field()
  password!: string;
}
