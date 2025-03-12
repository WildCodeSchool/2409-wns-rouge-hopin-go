import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Info,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Ride, RideCreateInput, RideUpdateInput } from "../entities/Ride";
import { validate } from "class-validator";
import { decode, sign, verify } from "jsonwebtoken";
import Cookies from "cookies";
import { ContextType } from "../auth";

@Resolver()
export class RidesResolver {
  @Authorized()
  @Query(() => [Ride])
  async rides(@Ctx() context: ContextType): Promise<Ride[] | null> {
    const rides = await Ride.find();
    if (rides !== null) {
      return rides;
    } else {
      return null;
    }
  }

  @Authorized()
  @Query(() => Ride)
  async ride(
    @Arg("id", () => ID) id: number,
   // @Ctx() context: ContextType
  ): Promise<Ride | null> {
    const ride = await Ride.findOneBy({ id });
    if (ride) {
      return ride;
    } else {
      return null;
    }
  }

 // Need a Middleware to verify if the user is logged in
  @Mutation(() => Ride)
  async createRide(
    @Arg("data", () => RideCreateInput) data: RideCreateInput
  ): Promise<Ride> {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }
    const newRide = new Ride();
    try {
      Object.assign(newRide, data);
      await newRide.save();
      return newRide;
    } catch (error) {
      console.error(error);
      throw new Error("unable to create ride");
    }
  }

 // Need a Middleware to verify if the user is logged in and is the user that created the ride
  @Mutation(() => Ride, { nullable: true })
  async updateRide(
      @Arg("id", () => ID) id: number,
      @Arg("data", () => RideUpdateInput) data: RideUpdateInput
  ): Promise<Ride | null> {
      const ride = await Ride.findOneBy({ id });
      if (ride !== null) {

          await ride.save();
          return ride;
      } else {
          return null;
      }
  }

 // Need a Middleware to verify if the user is logged in and is the user that created the ride
  @Mutation(() => Ride, { nullable: true })
  async deleteRide(@Arg("id", () => ID) id: number): Promise<Ride | null> {
    const ride = await Ride.findOneBy({ id });
    if (ride !== null) {
      await ride.remove();
      Object.assign(ride, { id });
      return ride;
    } else {
      return null;
    }
  }
}
