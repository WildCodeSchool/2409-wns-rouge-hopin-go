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
import {
  PaginatedRides,
  Ride,
  RideCreateInput,
  RideUpdateInput,
  SearchRideInput,
} from "../entities/Ride";
import { validate } from "class-validator";
import { endOfDay, startOfDay } from "date-fns";
import { User } from "../entities/User";
import { PassengerRide, PassengerRideStatus } from "../entities/PassengerRide";
import { AuthContextType, ContextType } from "../auth";

@Resolver(() => Ride)
export class RidesResolver {
  @Query(() => [Ride])
  async searchRide(
    @Arg("data", () => SearchRideInput)
    data: SearchRideInput
  ): Promise<Ride[]> {
    try {
      const startDay = startOfDay(data.departure_at);
      const endDay = endOfDay(data.departure_at);

      const rides = await Ride.createQueryBuilder("ride")
        .innerJoinAndSelect("ride.driver_id", "driver")
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
            d_radius: data.departure_radius * 1000, // en mètres
          }
        )
        .andWhere(
          `ST_DWithin(
            ride.arrival_location,
            ST_SetSRID(ST_MakePoint(:a_lng, :a_lat), 4326)::geography,
            :a_radius
          )
        `,
          {
            a_lng: data.arrival_lng,
            a_lat: data.arrival_lat,
            a_radius: data.arrival_radius * 1000, // en mètres
          }
        )
        .andWhere("ride.departure_at BETWEEN :start AND :end", {
          start: startDay,
          end: endDay,
        })
        .andWhere("ride.is_cancelled = false")
        .andWhere("ride.nb_passenger < ride.max_passenger")
        .orderBy("ride.departure_at", "ASC")
        .getMany();
      console.log(
        "🚀 ~ RidesResolver ~ rides:",
        rides.map((ride) => ride.departure_location.coordinates)
      );
      return rides;
    } catch (error) {
      console.error("Une erreur est survenue lors de la recherche.", error);
      throw new Error("Une erreur est survenue lors de la recherche.");
    }
  }

  @Query(() => [Ride])
  async rides(): Promise<Ride[] | null> {
    const rides = await Ride.find({
      relations: ["driver_id"],
    });
    return rides;
  }

  // @Authorized()
  @Query(() => Ride)
  async ride(
    @Arg("id", () => ID) id: number
    // @Ctx() context: ContextType
  ): Promise<Ride | null> {
    const ride = await Ride.findOne({
      where: { id },
      relations: ["driver_id"],
    });
    if (ride) {
      return ride;
    } else {
      return null;
    }
  }

  @Query(() => PaginatedRides)
  async driverRides(
    @Ctx() ctx: AuthContextType,
    @Arg("filter", () => String, { nullable: true }) filter?: string,
    @Arg("limit", () => Int, { nullable: true }) limit = 10,
    @Arg("offset", () => Int, { nullable: true }) offset = 0,
    @Arg("sort", () => String, { nullable: true }) sort: "ASC" | "DESC" = "ASC"
  ): Promise<PaginatedRides> {
    if (!ctx.user) throw new Error("Unauthorized");

    const userId = ctx.user.id;
    const now = new Date();

    const baseQuery = Ride.createQueryBuilder("ride")
      .leftJoinAndSelect("ride.driver_id", "driver")
      .leftJoinAndSelect("ride.passenger_rides", "passengerRide")
      .leftJoinAndSelect("passengerRide.user", "passenger")
      .where("ride.driver_id = :userId", { userId });

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

    // Tri secondaire
    baseQuery.addOrderBy("ride.departure_at", sort);

    const [rides, totalCount] = await baseQuery
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return { rides, totalCount };
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
      Object.assign(newRide, {
        ...data,
        departure_location: {
          type: "Point",
          coordinates: [data.departure_lng, data.departure_lat],
        },
        arrival_location: {
          type: "Point",
          coordinates: [data.arrival_lng, data.arrival_lat],
        },
      });
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
