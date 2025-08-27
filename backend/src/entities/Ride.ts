import {
  IsDate,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from "class-validator";
import { Field, Float, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { IsFutureDate } from "../validators/IsFutureDate";
import { IdInput } from "./Id";
import { PassengerRide, PassengerRideStatus } from "./PassengerRide";

@ObjectType()
export class Point {
  @Field()
  type!: "Point";
  @Field(() => [Float])
  coordinates!: [number, number];
}
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

  @Field(() => Date)
  @Column({ type: "timestamp" })
  departure_at!: Date;

  @Field(() => Date)
  @Column({ type: "timestamp" })
  arrival_at!: Date;

  @Column()
  @Field()
  max_passenger!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "driver" }) // this specifies the name of the column in the database
  @Field(() => User)
  driver!: User;

  @Column({ default: 0 })
  @Field()
  nb_passenger!: number;

  @Field(() => Number)
  get available_seats(): number {
    return this.max_passenger - this.nb_passenger;
  }

  @Column({ type: "geography", spatialFeatureType: "Point", srid: 4326 })
  @Field(() => Point)
  departure_location!: Point;

  @Column({ type: "geography", spatialFeatureType: "Point", srid: 4326 })
  @Field(() => Point)
  arrival_location!: Point;

  @Column({ default: false })
  @Field(() => Boolean)
  is_cancelled!: boolean;

  @CreateDateColumn()
  @Field()
  created_at!: Date;

  @OneToMany(() => PassengerRide, (pr) => pr.ride)
  @Field(() => [PassengerRide], { nullable: true })
  passenger_rides?: PassengerRide[];

  @Field(() => PassengerRideStatus, { nullable: true })
  current_user_passenger_status?: PassengerRideStatus;
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
  driver!: IdInput;

  @Field(() => Date)
  @IsDate()
  departure_at!: Date;

  @Field(() => Date)
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
export class SearchRideInput {
  @Field()
  @MinLength(2, { message: "City must be at least 2 characters long" })
  @MaxLength(100, { message: "City cannot exceed 100 characters" })
  departure_city!: string;

  @Field()
  departure_lng!: number;

  @Field()
  departure_lat!: number;

  @Field()
  departure_radius!: number;

  @Field()
  @MinLength(2, { message: "City must be at least 2 characters long" })
  @MaxLength(100, { message: "City cannot exceed 100 characters" })
  arrival_city!: string;

  @Field()
  arrival_lng!: number;

  @Field()
  arrival_lat!: number;

  @Field()
  arrival_radius!: number;

  @Field(() => Date)
  @IsDate()
  @Validate(IsFutureDate)
  departure_at!: Date;
}

@ObjectType()
export class PaginatedRides {
  @Field(() => [Ride])
  rides!: Ride[];

  @Field()
  totalCount!: number;
}
