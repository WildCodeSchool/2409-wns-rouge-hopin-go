import { Arg, Authorized, Ctx, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import {
  CreatePassengerRideInput,
  PassengerRide,
  PassengerRideStatus,
  DriverSetPassengerRideStatusInput,
} from "../entities/PassengerRide";
import { validate } from "class-validator";
import { PaginatedRides, Ride } from "../entities/Ride";
import { AuthContextType } from "../auth";
import { datasource } from "../datasource";
import { ContextType } from "../auth";
import { attachPricingSelects, hydratePricingFromRaw } from "../utils/attachPricingSelects";
import {
  notifyDriverNewPassenger,
  notifyUserRideRefused,
  notifyUserRideValidation,
} from "../mail/rideEmails";
import { User } from "../entities/User";

@Resolver()
export class PassengerRideResolver {
  @Authorized("user")
  @Query(() => [PassengerRide])
  async passengersByRide(@Arg("ride_id", () => ID) ride_id: number): Promise<PassengerRide[]> {
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
        lock: { mode: "pessimistic_write" }, // ensures that only one user can book the ride at a time
      });

      if (!ride) throw new Error("Ride not found");

      if (user === null) {
        throw new Error("Unauthenticated user");
      }

      const rideWithDriver = await manager.findOne(Ride, {
        where: { id: data.ride_id },
        relations: ["driver"],
      });

      if (!rideWithDriver) throw new Error("Driver not found");

      if (rideWithDriver.driver.id === user!.id) {
        throw new Error("You cannot book your own ride");
      }

      // Check remaining seats
      if (ride.nb_passenger >= ride.max_passenger) {
        throw new Error("This ride is already full");
      }

      // Create PassengerRide tuple
      const newPassengerRide = manager.create(PassengerRide, data);
      await manager.save(newPassengerRide);

      // Email notification to the driver
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

  @Authorized("user")
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

    const queryBuilder = Ride.createQueryBuilder("ride")
      // INNER JOIN filters rides by PR of the current user
      .innerJoin("ride.passenger_rides", "pr", "pr.user_id = :userId", {
        userId,
      })
      .leftJoinAndSelect("ride.driver", "driver")
      .leftJoinAndSelect("ride.passenger_rides", "passengerRide")
      .leftJoinAndSelect("passengerRide.user", "passenger");

    if (filter === "upcoming") {
      queryBuilder.andWhere("ride.departure_at > :now", { now });
      queryBuilder.andWhere("ride.is_cancelled = false");
      queryBuilder.andWhere("pr.status IN (:...ok)", {
        ok: [PassengerRideStatus.WAITING, PassengerRideStatus.APPROVED],
      });
    } else if (filter === "archived") {
      // includes past OR cancelled OR statuses cancelled/refused
      queryBuilder.andWhere(
        `(
        ride.departure_at < :now
        OR ride.is_cancelled = true
        OR pr.status IN (:...arch)
      )`,
        {
          now,
          arch: [
            PassengerRideStatus.CANCELLED_BY_DRIVER,
            PassengerRideStatus.CANCELLED_BY_PASSENGER,
            PassengerRideStatus.REFUSED,
          ],
        }
      );
    } else if (filter === "canceled") {
      queryBuilder.andWhere(
        `ride.is_cancelled = true
       OR pr.status IN (:...arch)`,
        {
          arch: [
            PassengerRideStatus.CANCELLED_BY_DRIVER,
            PassengerRideStatus.CANCELLED_BY_PASSENGER,
            PassengerRideStatus.REFUSED,
          ],
        }
      );
    } else if (filter && filter !== "all") {
      throw new Error("Invalid filter");
    }

    queryBuilder.addOrderBy("ride.departure_at", sort);

    // Attach pricing selects
    attachPricingSelects(queryBuilder, {
      perKm: 0.14,
      minFare: 2.5,
      minFareKm: 10,
      roundTo: 2,
    });
    
    const [rides, totalCount, raw] = await Promise.all([
      queryBuilder.take(limit).skip(offset).getMany(),
      queryBuilder.getCount(),
      queryBuilder.getRawMany(),
    ]);

    // Hydrate pricing
    hydratePricingFromRaw(rides, raw);

    // Hydrate the current user's status without raw: via entities
    for (const r of rides) {
      const myPassengerRide = r.passenger_rides?.find((x) => x.user_id === userId);
      r.current_user_passenger_status = myPassengerRide?.status ?? undefined;
    }

    return { rides, totalCount };
  }

  @Authorized("user")
  @Mutation(() => PassengerRide)
  async driverSetPassengerRideStatus(
    @Arg("data")
    { ride_id, user_id, status }: DriverSetPassengerRideStatusInput,
    @Ctx() ctx: AuthContextType
  ): Promise<PassengerRide> {
    return await datasource.transaction(async (manager) => {
      const passengerRide = await PassengerRide.findOne({
        where: { user_id, ride_id },
        relations: { user: true, ride: { driver: true } },
      });

      if (!passengerRide) {
        throw new Error("Passenger ride not found");
      }

      const driverId = passengerRide.ride.driver.id;
      if (ctx.user?.id !== driverId) {
        throw new Error("Only the driver of the ride can update the passenger status");
      }

      if (passengerRide.ride.max_passenger === passengerRide.ride.nb_passenger) {
        throw new Error("The ride is already full");
      }

      const ride = await manager.findOne(Ride, {
        where: { id: ride_id },
        lock: { mode: "pessimistic_write" }, // ensures that only one user can validate or reject a passenger at a time
      });
      if (!ride) {
        throw new Error("Ride not found");
      }

      // status change to APPROVED: check if there are still seats
      if (status === PassengerRideStatus.APPROVED && ride.nb_passenger >= ride.max_passenger) {
        throw new Error("This ride is already full");
      }

      // Update the passenger status (approved or refused)
      passengerRide.status = status;
      await manager.save(passengerRide);

      // Email notification to the passenger about the validation or refusal of their ride
      if (status === PassengerRideStatus.APPROVED) {
        await notifyUserRideValidation(passengerRide.user, ride);
      } else if (status === PassengerRideStatus.REFUSED) {
        await notifyUserRideRefused(passengerRide.user, ride);
      }

      // If approved, increment the number of passengers in the ride
      if (status === PassengerRideStatus.APPROVED) {
        ride.nb_passenger += 1;
        await manager.save(ride);
      }

      // If the ride is full, update the status of all remaining waiting passengers to "refused"
      // to avoid overbooking
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
