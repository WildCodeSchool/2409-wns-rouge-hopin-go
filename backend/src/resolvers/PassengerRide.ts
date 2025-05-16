import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import {
  CreatePassengerRideInput,
  PassengerRide,
} from "../entities/PassengerRide";
import { validate } from "class-validator";
import { datasource } from "../datasource";
import { Ride } from "../entities/Ride";

@Resolver()
export class PassengerRideResolver {
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

  @Authorized()
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
}
