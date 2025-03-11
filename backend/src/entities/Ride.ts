import { Matches, MaxLength, MinLength } from "class-validator";
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

@Entity()
@ObjectType()
export class Ride extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Field()
  departure_city!: string;

  @Column({ enum: ["ride", "admin"], default: "ride" })
  @Field()
  role!: string;

  @Column()
  // @Field()
  hashedPassword!: string;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  // may be needed if ride can create other rides
  // @ManyToOne(() => Ride)
  // @Field(() => Ride)
  // createdBy!: Ride;
}

@InputType()
export class RideCreateInput {
  @Field()
  departure_city!: string;

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
export class RideUpdateInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}
