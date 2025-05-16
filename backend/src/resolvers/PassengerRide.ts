import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import {
  CreatePassengerRideInput,
  PassengerRide,
} from "../entities/PassengerRide";
import { validate } from "class-validator";
import { Ride } from "../entities/Ride";
import { LessThan, MoreThan } from "typeorm";
import { AuthContextType } from "../auth";
import { datasource } from "../datasource";

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
    return await datasource.transaction(async (manager) => {
      const ride = await manager.findOne(Ride, {
        where: { id: data.ride_id },
        lock: { mode: "pessimistic_write" }, // évite les conflits concurrents
      });

      if (!ride) throw new Error("Trajet introuvable");

      // Vérification du nombre de places restantes
      if (ride.nb_passenger >= ride.max_passenger) {
        throw new Error("Ce trajet est déjà complet");
      }

      // Création du tuple PassengerRide
      const newPassengerRide = manager.create(PassengerRide, data);
      await manager.save(newPassengerRide);

      return newPassengerRide;
    });
  }

  @Query(() => [Ride])
  async passengerRides(
    @Ctx() ctx: AuthContextType,
    @Arg("filter", () => String, { nullable: true }) filter?: string
  ): Promise<Ride[]> {
    if (!ctx.user) throw new Error("Unauthorized");

    const now = new Date();

    const passengerRides = await PassengerRide.find({
      where: { user_id: ctx.user.id },
      relations: {
        ride: { driver_id: true },
      },
    });

    const rides = passengerRides
      .map((passengerRide) => passengerRide.ride)
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
