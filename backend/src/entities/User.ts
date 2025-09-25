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
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContextType } from "../auth";
import { PassengerRide } from "./PassengerRide";

export const IsUser: MiddlewareFn<ContextType> = async (
  { context, root }: { context: ContextType; root: unknown },
  next: () => Promise<unknown>
) => {
  if (context.user) {
    if (
      context.user.role === "admin" ||
      context.user.id === (root as User).id
    ) {
      //si je suis admin ou si je suis le user il faut que le user connecté soit le même que le user requêté
      return await next(); // dans ce cas on poursuit le traitement
    } else {
      return null; // sinon on arrête tout et on renvoie null
    }
  }
};

@Entity()
@ObjectType()
@Check("char_length(first_name) >= 2")
@Check("char_length(last_name) >= 2")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ name: "first_name", type: "varchar", length: 50, nullable: false })
  @Field()
  firstName!: string;

  @Column({ name: "last_name", type: "varchar", length: 100, nullable: false })
  @Field()
  lastName!: string;

  // email unique insensible à la casse (citext)
  @Column({ type: "citext", unique: true, nullable: false })
  @IsEmail({}, { message: "Invalid email" })
  @Field({ nullable: true }) // this should be nullable because only admins + self user may see this, null otherwise
  @UseMiddleware(IsUser)
  email!: string;

  @Column({
    type: "enum",
    enum: ["user", "admin"],
    enumName: "userRole",
    default: "user",
  })
  @Field()
  role!: string;

  @Column({
    name: "hashed_password",
    type: "varchar",
    length: 255,
    nullable: false,
  })
  // @Field()
  hashedPassword!: string;

  @CreateDateColumn({
    type: "timestamptz",
    name: "created_at",
    default: () => "now()",
  })
  @Field()
  createdAt!: Date;

  @OneToMany(() => PassengerRide, (pr) => pr.user)
  passenger_rides!: PassengerRide[];

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
  @MinLength(2, { message: "Firstname must be at least 2 characters long" })
  @MaxLength(50, { message: "Firstname cannot exceed 50 characters" })
  firstName!: string;

  @Field()
  @MinLength(2, { message: "Lastname must be at least 2 characters long" })
  @MaxLength(100, { message: "Lastname cannot exceed 100 characters" })
  lastName!: string;

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
