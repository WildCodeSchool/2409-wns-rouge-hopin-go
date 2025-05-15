import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreatePassengerRideInput, PassengerRide } from "../entities/PassengerRide";
import { validate } from "class-validator";

@Resolver()
export class PassengerRideResolver {

@Query(() => [PassengerRide])
  async passengerRide(
    @Arg("data", () => CreatePassengerRideInput) data: CreatePassengerRideInput
  ): Promise<PassengerRide | null> {
    try {
      const passengerRide = await PassengerRide.findOne(({
            where: { ride_id: data.ride_id, user_id: data.user_id },
          }));
          if (passengerRide) {
            return passengerRide;
          } else {
            return null;
          }
    } catch (error) {
      console.error(error);
      throw new Error("unable to communicate with the database");
    }
  }

@Mutation(() => PassengerRide)
  async createPassengerRide(
    @Arg("data", () => CreatePassengerRideInput) data: CreatePassengerRideInput
  ): Promise<PassengerRide> {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }
    const newPassengerRide = new PassengerRide();
    try {
      Object.assign(newPassengerRide, data);
      await newPassengerRide.save();
      return newPassengerRide;
    } catch (error) {
      console.error(error);
      throw new Error("unable to create passenger_ride");
    }
  }
}