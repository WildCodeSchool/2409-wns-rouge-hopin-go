import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import {
  CreatePassengerRideInput,
  PassengerRide,
} from "../entities/PassengerRide";
import { validate } from "class-validator";
import { datasource } from "../datasource";
import { Ride } from "../entities/Ride";
import { ContextType } from "../auth";

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
          relations: ['driver_id']
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
}
