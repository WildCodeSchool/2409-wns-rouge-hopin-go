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
  notifyDriverPassengerWithdraw,
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

  if (!user) throw new Error("Unauthenticated user");

  return await datasource.transaction(async (manager) => {
    // Lock the ride row to prevent concurrent seat booking
    const ride = await manager.findOne(Ride, {
      where: { id: data.ride_id },
      lock: { mode: "pessimistic_write" },
    });
    if (!ride) throw new Error("Ride not found");

    // Load the ride with driver relation
    const rideWithDriver = await manager.findOne(Ride, {
      where: { id: data.ride_id },
      relations: ["driver"],
    });
    if (!rideWithDriver) throw new Error("Driver not found");

    // Prevent drivers from booking their own ride
    if (rideWithDriver.driver.id === user.id) {
      throw new Error("You cannot book your own ride");
    }

    // Check remaining seats
    if (ride.nb_passenger >= ride.max_passenger) {
      throw new Error("This ride is already full");
    }

    // Check if a PassengerRide tuple already exists for this user and ride
    const existing = await manager.findOne(PassengerRide, {
      where: { user_id: data.user_id, ride_id: data.ride_id },
    });

    if (existing) {
      // Already approved or waiting -> block rebooking
      if (
        existing.status === PassengerRideStatus.WAITING ||
        existing.status === PassengerRideStatus.APPROVED
      ) {
        throw new Error("You already have a reservation for this ride");
      }

      // Rebooking allowed only if the passenger cancelled themselves
      if (existing.status === PassengerRideStatus.CANCELLED_BY_PASSENGER) {
        existing.status = PassengerRideStatus.WAITING;
        await manager.save(existing);

        // Send email notification to the driver
        const driver = await manager.findOneByOrFail(User, {
          id: rideWithDriver.driver.id,
        });
        const passenger = await manager.findOneByOrFail(User, {
          id: data.user_id,
        });
        await notifyDriverNewPassenger(driver, passenger, ride);

        return existing;
      }

      // Rebooking blocked if the driver refused the passenger
      if (existing.status === PassengerRideStatus.REFUSED) {
        throw new Error("You cannot rebook this ride because the driver refused your request");
      }
    }

    // Create a new PassengerRide entry
    const newPassengerRide = manager.create(PassengerRide, {
      user_id: data.user_id,
      ride_id: data.ride_id,
      status: PassengerRideStatus.WAITING,
    });
    await manager.save(newPassengerRide);

    // Send notification email to the driver
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
    for (const ride of rides) {
      const myPassengerRide = ride.passenger_rides?.find((x) => x.user_id === userId);
      ride.current_user_passenger_status = myPassengerRide?.status ?? undefined;
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

  @Authorized("user")
  @Mutation(() => PassengerRide)
  async passengerWithdrawFromRide(
    @Arg("ride_id", () => ID) ride_id: number,
    @Ctx() ctx: AuthContextType
  ): Promise<PassengerRide> {
    const userId = ctx.user?.id;
    if (!userId) throw new Error("Unauthorized");

    return await datasource.transaction("READ COMMITTED", async (manager) => {
      const passengerRide = await manager
        .getRepository(PassengerRide)
        .createQueryBuilder("pr")
        .setLock("pessimistic_write")
        .where("pr.user_id = :userId AND pr.ride_id = :rideId", { userId, rideId: ride_id })
        .getOne();

      if (!passengerRide) throw new Error("Passenger ride not found");
      if (passengerRide.user_id !== userId) {
        throw new Error("Only the passenger of the ride can withdraw from the ride");
      }

      const ride = await manager
        .getRepository(Ride)
        .createQueryBuilder("r")
        .setLock("pessimistic_write")
        .where("r.id = :rideId", { rideId: ride_id })
        .getOne();

      if (!ride) throw new Error("Ride not found");

      // Prevent withdrawal after departure
      const now = new Date();
      if (ride.departure_at && ride.departure_at <= now) {
        throw new Error("Ride already started or finished");
      }

      // Idempotence: if already cancelled, just return the existing record
      if (
        passengerRide.status === PassengerRideStatus.CANCELLED_BY_PASSENGER ||
        passengerRide.status === PassengerRideStatus.CANCELLED_BY_DRIVER
      ) {
        // Reload with relations for the response
        const already = await manager.getRepository(PassengerRide).findOneOrFail({
          where: { user_id: userId, ride_id },
          relations: { user: true, ride: { driver: true } },
        });
        return already;
      }

      // If APPROVED, atomically decrement the counter, without going below 0
      if (passengerRide.status === PassengerRideStatus.APPROVED) {
        await manager
          .getRepository(Ride)
          .createQueryBuilder()
          .update(Ride)
          .set({ nb_passenger: () => "GREATEST(nb_passenger - 1, 0)" })
          .where("id = :rideId", { rideId: ride_id })
          .execute();
      }

      // Update the status of the PassengerRide
      await manager
        .getRepository(PassengerRide)
        .createQueryBuilder()
        .update(PassengerRide)
        .set({ status: PassengerRideStatus.CANCELLED_BY_PASSENGER })
        .where("user_id = :userId AND ride_id = :rideId", { userId, rideId: ride_id })
        .execute();

      // Reload with relations for the response
      const updated = await manager.getRepository(PassengerRide).findOneOrFail({
        where: { user_id: userId, ride_id },
        relations: { user: true, ride: { driver: true } },
      });

      // Notify the driver that the passenger withdrew
    await notifyDriverPassengerWithdraw(updated.ride.driver, updated.user, { ...ride } as Ride);

      return updated;
    });
  }
}
