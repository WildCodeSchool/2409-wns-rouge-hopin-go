import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Info,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Ride, RideCreateInput, RideUpdateInput, SearchRideInput } from "../entities/Ride";
import { validate } from "class-validator";
import { ContextType } from "../auth";
import { Between, ILike, MoreThan } from "typeorm";

@Resolver()
export class RidesResolver {
  @Query(() => [Ride])
  async searchRide(
    @Arg("data", () => SearchRideInput, { nullable: true })
    data: SearchRideInput
  ): Promise<Ride[] | null> {
    try {
      const filter: any = {};
      if (data) {
        if (data.departure_city) {
          filter.departure_city = ILike(`%${data.departure_city}%`);
        }
        if (data.arrival_city) {
          filter.arrival_city = ILike(`%${data.arrival_city}%`);
        }
        const startDay = new Date(data.departure_at);
        startDay.setHours(0, 0, 0, 0);
        const endDay = new Date(data.departure_at);
        endDay.setHours(23, 59, 59, 999);

        filter.departure_at = Between(startDay, endDay);
      }
      filter.is_canceled = false;
      // const fromToday = new Date(data.departure_at);
      // fromToday.setHours(0, 0, 0, 0);
      // filter.departure_at = MoreThan(fromToday);

      const rides = await Ride.find({
        where: filter,
        order: {
          departure_at: "ASC",
        },
        relations: ["driverId"],
      });

      const ridesFiltered = rides.filter((ride) => {
        return Number(ride.nb_passenger) < Number(ride.max_passenger);
      });
      return ridesFiltered;
    } catch (error) {
      console.error("Une erreur est survenue lors de la recherche.");
      throw new Error("Une erreur est survenue lors de la recherche.");
    }
  }

  @Query(() => [Ride])
  async Rides(): Promise<Ride[] | null> {
    const rides = await Ride.find({
      relations: ["driverId"],
    });
    return rides;
  }
  @Authorized()
  @Query(() => [Ride])
  async rides(@Ctx() context: ContextType): Promise<Ride[] | null> {
    const rides = await Ride.find();
    if (rides !== null) {
      return rides;
    } else {
      return null;
    }
  }

  @Authorized()
  @Query(() => Ride)
  async ride(
    @Arg("id", () => ID) id: number,
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
