import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Ride, SearchRidesInput } from "../entities/Ride";
import { ContextType } from "../auth";
import { Between, ILike } from "typeorm";
import { start } from "repl";

@Resolver()
export class RidesResolver {
  @Query(() => [Ride])
  async searchRide(
    @Arg("data", () => SearchRidesInput, { nullable: true })
    data: SearchRidesInput
  ): Promise<Ride[] | null> {
    const filter: any = {};
    if (data) {
      if (data.departure_city) {
        filter.departure_city = ILike(`%${data.departure_city}%`);
      }
      if (data.arrival_city) {
        filter.arrival_city = ILike(`%${data.arrival_city}%`);
      }
      if (data.departure_at) {
        const startDay = new Date(data.departure_at);
        startDay.setHours(0, 0, 0, 0);
        const endDay = new Date(data.departure_at);
        endDay.setHours(23, 59, 59, 999);

        filter.departure_at = Between(startDay, endDay);
      }

      if (data.arrival_at) {
        const startDay = new Date(data.arrival_at);
        startDay.setHours(0, 0, 0, 0);
        const endDay = new Date(data.arrival_at);
        endDay.setHours(23, 59, 59, 999);

        filter.arrival_at = Between(startDay, endDay);
      }
    }

    const rides = await Ride.find({
      where: filter,
    });
    return rides;
  }
}
