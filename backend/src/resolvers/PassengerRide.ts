import { Arg, Mutation, Resolver } from "type-graphql";
import { CreatePassengerRideInput, PassengerRide } from "../entities/PassengerRide";
import { validate } from "class-validator";

@Resolver()
export class PassengerRideResolver {
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