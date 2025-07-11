import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import {
  CreatePassengerRideInput,
  PassengerRide,
} from "../entities/PassengerRide";
import { validate } from "class-validator";
import { Ride } from "../entities/Ride";
import { LessThan, MoreThan } from "typeorm";
import { AuthContextType } from "../auth";
import { datasource } from "../datasource";
import { ContextType } from "../auth";

@Resolver()
export class PassengerRideResolver {
  // @Authorized()
  @Query(() => [PassengerRide])
  async passengersByRide(
    @Arg("ride_id", () => ID) ride_id: number
  ): Promise<PassengerRide[]> {
    try {
      const passengersRide = await PassengerRide.find({
        where: { ride_id },
        relations: ["user"],
      });
      return passengersRide;
    } catch (error) {
      console.error(error);
      throw new Error("unable to communicate with the database");
    }
  }

  @Authorized("user")
  @Mutation(() => PassengerRide)
  async createPassengerRide(
    @Arg("data", () => CreatePassengerRideInput) data: CreatePassengerRideInput,
    @Ctx() { user }: ContextType
  ): Promise<PassengerRide> {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }
    return await datasource.transaction(async (manager) => {
      const ride = await manager.findOne(Ride, {
        where: { id: data.ride_id },
        lock: { mode: "pessimistic_write" }, // s'assure qu'un seul utilisateur peut réserver le trajet à la fois
      });

      if (!ride) throw new Error("Trajet introuvable");

      if (user === null) {
        throw new Error("Utilisateur non authentifié");
      }

      const rideWithDriver = await manager.findOne(Ride, {
        where: { id: data.ride_id },
        relations: ["driver_id"],
      });

      if (!rideWithDriver) throw new Error("Conducteur introuvable");

      if (rideWithDriver.driver_id.id === user!.id) {
        throw new Error("Vous ne pouvez pas réserver votre propre trajet");
      }

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
