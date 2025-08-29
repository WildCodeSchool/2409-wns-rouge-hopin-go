import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import {
  CreatePassengerRideInput,
  PassengerRide,
  PassengerRideStatus,
  UpdatePassengerRideStatusInput,
} from "../entities/PassengerRide";
import { validate } from "class-validator";
import { PaginatedRides, Ride } from "../entities/Ride";
import { LessThan, MoreThan } from "typeorm";
import { AuthContextType } from "../auth";
import { datasource } from "../datasource";
import { ContextType } from "../auth";
import {
  attachPricingSelects,
  hydratePricingFromRaw,
} from "../utils/attachPricingSelects";
import { notifyDriverNewPassenger } from "../mail/rideEmails";
import { User } from "../entities/User";

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
        relations: ["driver"],
      });

      if (!rideWithDriver) throw new Error("Conducteur introuvable");

      if (rideWithDriver.driver.id === user!.id) {
        throw new Error("Vous ne pouvez pas réserver votre propre trajet");
      }

      // Vérification du nombre de places restantes
      if (ride.nb_passenger >= ride.max_passenger) {
        throw new Error("Ce trajet est déjà complet");
      }

      // Création du tuple PassengerRide
      const newPassengerRide = manager.create(PassengerRide, data);
      await manager.save(newPassengerRide);

      // Notification par email au conducteur
      const driver = await manager.findOneByOrFail(User, {
        id: rideWithDriver.driver.id,
      });
      const passenger = await manager.findOneByOrFail(User, {
        id: data.user_id,
      });
      await notifyDriverNewPassenger(driver, passenger, ride);
      return newPassengerRide;
    });
  }

  @Query(() => PaginatedRides)
  async passengerRides(
    @Ctx() ctx: AuthContextType,
    @Arg("filter", () => String, { nullable: true }) filter?: string,
    @Arg("limit", () => Int, { nullable: true }) limit = 10,
    @Arg("offset", () => Int, { nullable: true }) offset = 0,
    @Arg("sort", () => String, { nullable: true }) sort: "ASC" | "DESC" = "ASC"
  ): Promise<PaginatedRides> {
    if (!ctx.user) throw new Error("Unauthorized");

    const now = new Date();
    const userId = ctx.user.id;

    const baseQuery = Ride.createQueryBuilder("ride")
      .innerJoin("ride.passenger_rides", "pr", "pr.user_id = :userId", {
        userId,
      })
      .leftJoinAndSelect("ride.driver", "driver")
      .leftJoinAndSelect("ride.passenger_rides", "passengerRide")
      .leftJoinAndSelect("passengerRide.user", "passenger");

    if (filter === "upcoming") {
      baseQuery.andWhere("ride.departure_at > :now", { now });
      baseQuery.andWhere("ride.is_cancelled = false");
    } else if (filter === "archived") {
      baseQuery.andWhere("ride.departure_at < :now", { now });
    } else if (filter === "canceled") {
      baseQuery.andWhere("ride.is_cancelled = true");
    } else if (filter && filter !== "all") {
      throw new Error("Invalid filter");
    }

    baseQuery.addOrderBy("ride.departure_at", sort);

    // 👇 injecte les sélections de prix
    attachPricingSelects(baseQuery, {
      perKm: 0.14,
      minFare: 2.5,
      minFareKm: 10,
      roundTo: 2,
    });

    const [rides, totalCount, raw] = await Promise.all([
      baseQuery.take(limit).skip(offset).getMany(),
      baseQuery.getCount(),
      baseQuery.getRawMany(),
    ]);

    // recoller les valeurs calculées dans les entités
    hydratePricingFromRaw(rides, raw);

    return { rides, totalCount };
  }

  @Authorized("user")
  @Mutation(() => PassengerRide)
  async updatePassengerRideStatus(
    @Arg("data") { ride_id, user_id, status }: UpdatePassengerRideStatusInput,
    @Ctx() ctx: AuthContextType
  ): Promise<PassengerRide> {
    return await datasource.transaction(async (manager) => {
      const passengerRide = await PassengerRide.findOne({
        where: { user_id, ride_id },
        relations: { user: true, ride: { driver: true } },
      });

      if (!passengerRide) {
        throw new Error("Passager non trouvé pour ce trajet");
      }

      const driverId = passengerRide.ride.driver.id;
      if (ctx.user?.id !== driverId) {
        throw new Error(
          "Seul le conducteur peut modifier le statut du passager"
        );
      }

      if (
        passengerRide.ride.max_passenger === passengerRide.ride.nb_passenger
      ) {
        throw new Error("Ce trajet est déjà complet");
      }

      const ride = await manager.findOne(Ride, {
        where: { id: ride_id },
        lock: { mode: "pessimistic_write" }, // s'assure qu'un seul utilisateur peut modifier le trajet à la fois
      });
      if (!ride) {
        throw new Error("Trajet non trouvé");
      }

      // si on essaie d'approuver un passager alors que le trajet est complet, on bloque l'opération
      if (
        status === PassengerRideStatus.APPROVED &&
        ride.nb_passenger >= ride.max_passenger
      ) {
        throw new Error("Ce trajet est déjà complet");
      }

      // Mise à jour du statut du passager
      passengerRide.status = status;
      await manager.save(passengerRide);

      // Si le passager est approuvé, on incrémente le nombre de passagers du trajet
      if (status === PassengerRideStatus.APPROVED) {
        ride.nb_passenger += 1;
        await manager.save(ride);
      }

      // Si le passager est refusé, on met à jour son statut dans la table PassengerRide
      if (ride.nb_passenger >= ride.max_passenger) {
        await manager
          .createQueryBuilder()
          .update(PassengerRide)
          .set({ status: PassengerRideStatus.REFUSED })
          .where("ride_id = :rideId", { rideId: ride.id })
          .andWhere("status = :waiting", {
            waiting: PassengerRideStatus.WAITING,
          })
          .execute();
      }

      return passengerRide;
    });
  }
}
