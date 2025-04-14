import { Arg, Query, Resolver } from "type-graphql";
import { Ride, SearchRideInput } from "../entities/Ride";
import { Between, ILike, MoreThan } from "typeorm";

@Resolver()
export class RidesResolver {
  @Query(() => [Ride])
  async searchRide(
    @Arg("data", () => SearchRideInput, { nullable: true })
    data: SearchRideInput
  ): Promise<Ride[] | null> {
    const filter: any = {};
    if (data) {
      if (data.departure_city) {
        filter.departure_city = ILike(`%${data.departure_city}%`);
      }
      if (data.arrival_city) {
        filter.arrival_city = ILike(`%${data.arrival_city}%`);
      }
      if (data.departure_at < new Date()) {
        console.error(
          "La date et l'heure de départ doivent être supérieures à la date et l'heure actuelle"
        );
        throw new Error(
          "La date et l'heure de départ doivent être supérieures à la date et l'heure actuelle"
        );
      } else {
        const startDay = new Date(data.departure_at);
        startDay.setHours(0, 0, 0, 0);
        const endDay = new Date(data.departure_at);
        endDay.setHours(23, 59, 59, 999);

        filter.departure_at = Between(startDay, endDay);
      }
    }
    filter.is_canceled = false;
    const fromToday = new Date(data.departure_at);
    fromToday.setHours(0, 0, 0, 0);
    filter.departure_at = MoreThan(fromToday);

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
  }

  @Query(() => [Ride])
  async Rides(): Promise<Ride[] | null> {
    const rides = await Ride.find({
      relations: ["driverId"],
    });
    return rides;
  }
}
