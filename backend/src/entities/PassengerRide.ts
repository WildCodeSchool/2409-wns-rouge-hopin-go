import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Ride } from "./Ride";
import { User } from "./User";

@Entity()
@ObjectType()
export class PassengerRide extends BaseEntity {

  @PrimaryColumn()
  @Field(() => ID)
  user_id!: number;

  @Field(() => ID)
  @PrimaryColumn()
  ride_id!: number;

  @Field()
  @Column({ enum: ["approved", "refused", "waiting"], default: "waiting" })
  status!: string;

  @ManyToOne(() => User, (user) => user.passengerRides)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Ride, (ride) => ride.passengerRides)
  @JoinColumn({ name: 'ride_id' })
  ride!: Ride;
}

@InputType()
export class CreatePassengerRideInput {
  @Field(() => ID)
  user_id!: number;

  @Field(() => ID)
  ride_id!: number;
}