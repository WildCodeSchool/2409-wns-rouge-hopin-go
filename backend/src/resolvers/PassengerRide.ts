import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import {
  CreatePassengerRideInput,
  PassengerRide,
} from "../entities/PassengerRide";
import { validate } from "class-validator";
import { Ride } from "../entities/Ride";
import { LessThan, MoreThan } from "typeorm";
import { AuthContextType } from "../auth";

@Resolver()
export class PassengerRideResolver {
  // Rides où je suis conducteur
  @Query(() => [Ride])
  async driverRides(
    @Ctx() ctx: AuthContextType,
    @Arg("filter", () => String, { nullable: true }) filter?: string
  ): Promise<Ride[]> {
    if (!ctx.user) throw new Error("Unauthorized");

    const userId = ctx.user.id;
    const now = new Date();

    let where: any = { driver_id: { id: userId } };

    if (filter === "upcoming") {
      where = { ...where, departure_at: MoreThan(now), is_canceled: false };
    } else if (filter === "archived") {
      where = { ...where, departure_at: LessThan(now) };
    } else if (filter === "canceled") {
      where = { ...where, is_canceled: true };
    }

    return Ride.find({
      where,
      relations: ["driver_id"],
      order: { departure_at: "DESC" },
    });
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

  @Query(() => [PassengerRide])
  async passengerRide(
    @Arg("data", () => CreatePassengerRideInput) data: CreatePassengerRideInput
  ): Promise<PassengerRide | null> {
    try {
      const passengerRide = await PassengerRide.findOne({
        where: { ride_id: data.ride_id, user_id: data.user_id },
      });
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

  @Query(() => [Ride])
  async passengerRides(
    @Ctx() ctx: AuthContextType,
    @Arg("filter", () => String, { nullable: true }) filter?: string
  ): Promise<Ride[]> {
    if (!ctx.user) throw new Error("Unauthorized");

    const now = new Date();

    const prs = await PassengerRide.find({
      where: { user_id: ctx.user.id },
      relations: {
        ride: { driver_id: true },
      },
    });

    const rides = prs
      .map((pr) => pr.ride)
      .filter((ride) => {
        if (!ride) return false;
        if (ride.driver_id.id === ctx.user.id) return false; // pas ses propres rides
        if (filter === "upcoming")
          return new Date(ride.departure_at) > now && !ride.is_canceled;
        if (filter === "archived") return new Date(ride.departure_at) < now;
        return true; // "all"
      });

    return rides;
  }
}
