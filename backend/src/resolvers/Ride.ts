import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { PaginatedRides, Ride, RideCreateInput, SearchRideInput } from "../entities/Ride";
import { validate } from "class-validator";
import { endOfDay, startOfDay } from "date-fns";
import { User } from "../entities/User";
import { PassengerRide, PassengerRideStatus } from "../entities/PassengerRide";
import { AuthContextType, ContextType } from "../auth";
import { fetchRouteFromMapbox } from "../utils/fetchRouteFromMapBox";
import { attachPricingSelects, hydratePricingFromRaw } from "../utils/attachPricingSelects";
import { datasource } from "../datasource";
import { notifyUserRideCancelled } from "../mail/rideEmails";
import { findSimilarRouteFromDB } from "../utils/findSimilarRouteFromDB";

@Resolver(() => Ride)
export class RidesResolver {
  @Query(() => [Ride])
  async searchRide(@Arg("data", () => SearchRideInput) data: SearchRideInput): Promise<Ride[]> {
    try {
      const startDay = startOfDay(data.departure_at);
      const endDay = endOfDay(data.departure_at);

      // ---- Pagination --------------------------------------------------------------
      const limit = Math.min(Math.max(data.limit ?? 20, 1), 100);
      const offset = Math.max(data.offset ?? 0, 0);

      // ---- Query --------------------------------------------------------------
      const queryBuilder = Ride.createQueryBuilder("ride")
        .innerJoinAndSelect("ride.driver", "driver")
        .where(
          `
        ST_DWithin(
          ride.departure_location,
          ST_SetSRID(ST_MakePoint(:d_lng, :d_lat), 4326)::geography,
          :d_radius
        )
      `,
          {
            d_lng: data.departure_lng,
            d_lat: data.departure_lat,
            d_radius: data.departure_radius * 1000, // m
          }
        )
        .andWhere(
          `
        ST_DWithin(
          ride.arrival_location,
          ST_SetSRID(ST_MakePoint(:a_lng, :a_lat), 4326)::geography,
          :a_radius
        )
      `,
          {
            a_lng: data.arrival_lng,
            a_lat: data.arrival_lat,
            a_radius: data.arrival_radius * 1000, // m
          }
        )
        .andWhere("ride.departure_at BETWEEN :start AND :end", {
          start: startDay,
          end: endDay,
        })
        .andWhere("ride.is_cancelled = false")
        .andWhere("ride.nb_passenger < ride.max_passenger")
        .orderBy("ride.departure_at", "ASC")
        .addOrderBy("ride.id", "ASC")
        .take(limit)
        .skip(offset);

      attachPricingSelects(queryBuilder, {
        perKm: 0.14,
        minFare: 2.5,
        minFareKm: 10,
        roundTo: 2,
      });

      const { entities: rides, raw } = await queryBuilder.getRawAndEntities();

      hydratePricingFromRaw(rides, raw);

      return rides;
    } catch (error) {
      console.error("An error occurred during the search.", error);
      throw new Error("An error occurred during the search.");
    }
  }

  @Query(() => [Ride])
  async rides(): Promise<Ride[] | null> {
    const rides = await Ride.find({
      relations: ["driver"],
    });
    return rides;
  }

  @Query(() => Ride)
  async ride(@Arg("id", () => ID) id: number): Promise<Ride | null> {
    const ride = await Ride.findOne({
      where: { id },
      relations: ["driver"],
    });
    if (ride) {
      return ride;
    } else {
      return null;
    }
  }

  @Authorized("user")
  @Query(() => PaginatedRides)
  async driverRides(
    @Ctx() ctx: AuthContextType,
    @Arg("filter", () => String, { nullable: true }) filter?: string,
    @Arg("limit", () => Int, { nullable: true }) limit = 10,
    @Arg("offset", () => Int, { nullable: true }) offset = 0,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Arg("sort", () => String, { nullable: true }) sort: "ASC" | "DESC" = "ASC"
  ): Promise<PaginatedRides> {
    if (!ctx.user) throw new Error("Unauthorized");

    const userId = ctx.user.id;
    const now = new Date();

    const baseQuery = Ride.createQueryBuilder("ride")
      .leftJoinAndSelect("ride.driver", "driver")
      .leftJoinAndSelect("ride.passenger_rides", "passengerRide")
      .leftJoinAndSelect("passengerRide.user", "passenger")
      .where("ride.driver = :userId", { userId });

    if (filter === "upcoming") {
      baseQuery.andWhere("ride.departure_at > :now", { now });
      baseQuery.andWhere("ride.is_cancelled = false");
    } else if (filter === "archived") {
      baseQuery.andWhere("(ride.departure_at < :now OR ride.is_cancelled = true)", {
        now,
      });
    } else if (filter === "canceled") {
      baseQuery.andWhere("ride.is_cancelled = true");
    } else if (filter && filter !== "all") {
      throw new Error("Invalid filter");
    }

    // secondary sorting
    const order = filter === "archived" ? "DESC" : "ASC";
    baseQuery.orderBy("ride.departure_at", order);

    // Clone COUNT
    const countQueryBuilder = baseQuery.clone();
    const totalCount = await countQueryBuilder.getCount();

    // Clone DATA + pricing
    const dataQueryBuilder = baseQuery.clone();

    // injects price selections
    attachPricingSelects(dataQueryBuilder, {
      perKm: 0.13,
      minFare: 2.5,
      minFareKm: 10,
      roundTo: 2,
    });
    dataQueryBuilder.take(limit).skip(offset);
    // One round trip: raw + internally aligned entities
    const { entities: rides, raw } = await dataQueryBuilder.getRawAndEntities();

    // Hydrate via ride_id (independent of duplications due to LEFT JOINs)
    hydratePricingFromRaw(rides, raw);

    return { rides, totalCount };
  }

  @Authorized("user")
  @Mutation(() => Ride)
  async createRide(@Arg("data", () => RideCreateInput) data: RideCreateInput): Promise<Ride> {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

    // 1) Trying to reuse a nearly identical route from DB
    let distance_km: number | undefined;
    let duration_min: number | undefined;
    let route_polyline5: string | undefined;
    let source: "DB" | "MAPBOX" | "NONE" = "NONE";

    try {
      const cached = await findSimilarRouteFromDB(
        data.departure_lng,
        data.departure_lat,
        data.arrival_lng,
        data.arrival_lat,
        500 // tolerance 500 m
      );

      if (cached) {
        ({ distance_km, duration_min, route_polyline5 } = cached);
        source = "DB";
        console.log("🚀 ~ RidesResolver ~ createRide ~ source:", source);
      } else {
        // 2) Otherwise Mapbox
        const r = await fetchRouteFromMapbox(
          data.departure_lng,
          data.departure_lat,
          data.arrival_lng,
          data.arrival_lat
        );
        distance_km = r.distanceKm;
        duration_min = r.durationMin;
        route_polyline5 = r.polyline5;
        source = "MAPBOX";
        console.info("🚀 ~ RidesResolver ~ createRide ~ source:", source);
      }
    } catch (e) {
      source = "NONE";
      console.error("[createRide] route lookup/fetch failed, saving without route.", e);
    }

    // 3) arrival_at = departure_at + duration
    const departureAt = new Date(data.departure_at);
    const arrival_at = new Date(departureAt.getTime() + (duration_min ?? 0) * 60_000);

    // 4) Save ride
    const newRide = new Ride();
    Object.assign(newRide, {
      ...data,
      arrival_at,
      departure_location: {
        type: "Point",
        coordinates: [data.departure_lng, data.departure_lat],
      },
      arrival_location: {
        type: "Point",
        coordinates: [data.arrival_lng, data.arrival_lat],
      },
      distance_km,
      duration_min,
      route_polyline5,
    });

    await newRide.save();

    return newRide;
  }

  @Authorized("user")
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

  @Authorized("user")
  @Mutation(() => Ride)
  async cancelRide(@Arg("id", () => ID) id: number, @Ctx() ctx: AuthContextType): Promise<Ride> {
    return await datasource.transaction(async (manager) => {
      const ride = await manager.findOne(Ride, {
        where: { id },
        lock: { mode: "pessimistic_write" },
      });

      if (!ride) throw new Error("Ride not found");

      const rideWithDriver = await manager.findOne(Ride, {
        where: { id },
        relations: ["driver"],
      });

      if (ctx.user?.id !== rideWithDriver!.driver.id) {
        throw new Error("Only the driver can cancel a ride.");
      }
      const now = new Date();
      if (ride.departure_at < now) {
        throw new Error("Cannot cancel a ride that has already passed.");
      }

      if (ride.is_cancelled) return rideWithDriver!;

      ride.is_cancelled = true;
      await manager.save(ride);

      // Email notification to passengers of trip cancellation
      const toNotify =
        ride.passenger_rides
          ?.filter(
            (passenger) =>
              passenger.status === PassengerRideStatus.APPROVED ||
              passenger.status === PassengerRideStatus.WAITING
          )
          .map((passenger) => passenger.user) ?? [];

      for (const user of toNotify) {
        await notifyUserRideCancelled(user, ride);
      }

      // Updates the status of all passengers on the trip to "cancelled by driver"
      await manager
        .createQueryBuilder()
        .update(PassengerRide)
        .set({ status: PassengerRideStatus.CANCELLED_BY_DRIVER })
        .where("ride_id = :id", { id: ride.id })
        .andWhere("status IN (:...active)", {
          active: [PassengerRideStatus.WAITING, PassengerRideStatus.APPROVED],
        })
        .execute();
      return rideWithDriver!;
    });
  }

  @Authorized("user")
  @FieldResolver(() => String, { nullable: true })
  async current_user_passenger_status(
    @Root() ride: Ride,
    @Ctx() ctx: ContextType
  ): Promise<PassengerRideStatus | null> {
    const user = ctx.user as User;
    if (!user) return null;

    const passengerRide = await PassengerRide.findOne({
      where: {
        ride_id: ride.id,
        user_id: user.id,
      },
    });

    return passengerRide?.status || null;
  }
}
