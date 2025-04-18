import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import {
  Ride,
  RideCreateInput,
  RideUpdateInput,
  SearchRideInput,
} from "../entities/Ride";
import { validate } from "class-validator";

@Resolver()
export class RidesResolver {
  @Query(() => [Ride])
  async searchRide(
    @Arg("data", () => SearchRideInput)
    data: SearchRideInput
  ): Promise<Ride[]> {
    try {
      const startDay = new Date(data.departure_at);
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(data.departure_at);
      endDay.setHours(23, 59, 59, 999);
      const rides = await Ride.createQueryBuilder("ride")
        .innerJoinAndSelect("ride.driver_id", "driver")
        .where("ride.departure_city ILIKE :departure_city", {
          departure_city: `%${data.departure_city}%`,
        })
        .andWhere("ride.arrival_city ILIKE :arrival_city", {
          arrival_city: `%${data.arrival_city}%`,
        })
        .andWhere("ride.departure_at BETWEEN :start AND :end", {
          start: startDay,
          end: endDay,
        })
        .andWhere("ride.is_canceled = false")
        .andWhere("ride.nb_passenger < ride.max_passenger")
        .orderBy("ride.departure_at", "ASC")
        .getMany();
      return rides;
    } catch (error) {
      console.error("Une erreur est survenue lors de la recherche.", error);
      throw new Error("Une erreur est survenue lors de la recherche.");
    }
  }

  @Authorized()
  @Query(() => [Ride])
  async rides(): Promise<Ride[] | null> {
    const rides = await Ride.find({
      relations: ["driver_id"],
    });
    return rides;
  }

  @Authorized()
  @Query(() => Ride)
  async ride(
    @Arg("id", () => ID) id: number
    // @Ctx() context: ContextType
  ): Promise<Ride | null> {
    const ride = await Ride.findOneBy({ id });
    if (ride) {
      return ride;
    } else {
      return null;
    }
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
      Object.assign(newRide, data);
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
}
