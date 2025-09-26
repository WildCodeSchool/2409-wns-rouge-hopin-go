import {
  IsDate,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from "class-validator";
import { Field, Float, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Check,
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
@Check("max_passenger BETWEEN 1 AND 4")
@Check("nb_passenger >= 0")
@Check("nb_passenger <= max_passenger")
export class Ride extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  @Field()
  departure_city!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  @Field()
  arrival_city!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  @Field()
  departure_address!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  @Field()
  arrival_address!: string;

  @Field(() => Date)
  @Column({ type: "timestamptz", nullable: false })
  departure_at!: Date;

  @Field(() => Date)
  @Column({ type: "timestamptz", nullable: false })
  arrival_at!: Date;

  @Column({ type: "smallint", nullable: false })
  @Field()
  max_passenger!: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "driver_id" }) // this specifies the name of the column in the database
  @Field(() => User)
  driver!: User;

  @Column({ type: "smallint", default: 0, nullable: false })
  @Field()
  nb_passenger!: number;

  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  @Field(() => Float, { nullable: true })
  distance_km?: number;

  @Column({ type: "integer", nullable: true })
  @Field(() => Int, { nullable: true })
  duration_min?: number;

  // Polyline précision 5 (compatible Static Images)
  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  route_polyline5?: string;

  @Field(() => Number)
  get available_seats(): number {
    return this.max_passenger - this.nb_passenger;
  }

  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: false,
  })
  @Field(() => Point)
  departure_location!: Point;

  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: false,
  })
  @Field(() => Point)
  arrival_location!: Point;

  @Column({ type: "boolean", default: false, nullable: false })
  @Field(() => Boolean)
  is_cancelled!: boolean;

  @CreateDateColumn({
    type: "timestamptz",
    name: "created_at",
    default: () => "now()",
  })
  @Field()
  created_at!: Date;

  @OneToMany(() => PassengerRide, (pr) => pr.ride)
  @Field(() => [PassengerRide], { nullable: true })
  passenger_rides?: PassengerRide[];

  @Field(() => PassengerRideStatus, { nullable: true })
  current_user_passenger_status?: PassengerRideStatus;

  // ↙️ Champs calculés (pas de @Column)
  @Field(() => Float, { nullable: true })
  total_route_price?: number;

  @Field(() => Float, { nullable: true })
  price_per_passenger?: number;
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

  // @Field(() => Date, { nullable: true })
  // @IsDate()
  // arrival_at?: Date;

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
  @Max(100, { message: 'La rayon de recherche ne peut pas dépasser 100km' })
  @Min(0, { message: "Le rayon doit être au moins 0 km" })
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
  @Max(100, { message: 'La rayon de recherche ne peut pas dépasser 100km' })
  @Min(0, { message: "Le rayon doit être au moins 0 km" })
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
