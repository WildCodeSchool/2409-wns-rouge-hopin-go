import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Ride } from "./Ride";
import { User } from "./User";

export enum PassengerRideStatus {
  APPROVED = "approved",
  REFUSED = "refused",
  WAITING = "waiting",
  CANCELLED_BY_PASSENGER = "cancelled_by_passenger",
  CANCELLED_BY_DRIVER = "cancelled_by_driver",
}

registerEnumType(PassengerRideStatus, {
  name: "PassengerRideStatus",
});

@Entity()
@ObjectType()
export class PassengerRide extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  user_id!: number;

  @Field(() => ID)
  @PrimaryColumn()
  ride_id!: number;

  @Column({
    type: "enum",
    enum: PassengerRideStatus,
    default: PassengerRideStatus.WAITING,
  })
  @Field(() => PassengerRideStatus)
  status!: PassengerRideStatus;

  @ManyToOne(() => User, (user) => user.passenger_rides)
  @JoinColumn({ name: "user_id" })
  @Field(() => User)
  user!: User;

  @ManyToOne(() => Ride, (ride) => ride.passenger_rides)
  @JoinColumn({ name: "ride_id" })
  @Field(() => Ride)
  ride!: Ride;
}

@InputType()
export class CreatePassengerRideInput {
  @Field(() => ID)
  user_id!: number;

  @Field(() => ID)
  ride_id!: number;
}

@InputType()
export class DriverSetPassengerRideStatusInput {
  @Field(() => ID)
  user_id!: number;

  @Field(() => ID)
  ride_id!: number;

  @Field(() => PassengerRideStatus)
  status!: PassengerRideStatus;
}
