import {
  IsDate,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class Ride extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Field()
  departure_city!: string;

  @Column()
  @Field()
  arrival_city!: string;

  @Column()
  @Field()
  departure_address!: string;

  @Column()
  @Field()
  arrival_address!: string;

  @Column()
  @Field()
  departure_at!: Date;

  @Column()
  @Field()
  arrival_at!: Date;

  @Column()
  @Field()
  max_passenger!: number;

  @ManyToOne(() => User)
  @Field(() => User)
  driver!: User;

  @Column({ default: 0 })
  @Field()
  nb_passenger!: number;

  // It has to be declared automatically by the departure_city / arrival_city position
  @Column({ type: "decimal", precision: 10, scale: 6 })
  @Field()
  departure_lat!: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  @Field()
  departure_lng!: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  @Field()
  arrival_lat!: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  @Field()
  arrival_lng!: number;

  @Column({ default: false })
  @Field()
  is_canceled!: boolean;

  @CreateDateColumn()
  @Field()
  created_at!: Date;
}

@InputType()
export class RideCreateInput {
  @Field()
  @MaxLength(255)
  @IsString()
  departure_city!: string;

  @Field()
  @MaxLength(255)
  @IsString()
  arrival_city!: string;

  @Field()
  @MaxLength(255)
  @IsString()
  departure_address!: string;

  @Field()
  @MaxLength(255)
  @IsString()
  arrival_address!: string;

  @Field()
  @IsDate()
  departure_at!: Date;

  @Field()
  @IsDate()
  arrival_at!: Date;

  @Field()
  departure_lng!: number;

  @Field()
  departure_lat!: number;

  @Field()
  arrival_lng!: number;

  @Field()
  arrival_lat!: number;

  @Field()
  @Min(1)
  @Max(4)
  max_passenger!: number;
}

@InputType()
export class RideUpdateInput {
  @Field()
  departure_at!: string;

  @Field()
  arrival_at!: string;

  @Field()
  max_passenger!: number;

  @Field()
  is_canceled!: boolean;
}

@InputType()
export class SearchRidesInput {
  @Field()
  @MaxLength(255)
  departure_city!: string;

  @Field()
  @MaxLength(255)
  arrival_city!: string;

  @Field()
  @MaxLength(255)
  departure_at!: string;

  @Field({ nullable: true })
  @MaxLength(255)
  arrival_at!: string;
}
