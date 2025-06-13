import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import { UsersResolver } from "./resolvers/Users";
import { RidesResolver } from "./resolvers/Ride";
import { PassengerRideResolver } from "./resolvers/PassengerRide";

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [UsersResolver, RidesResolver, PassengerRideResolver],
    validate: true,
    authChecker,
  });
  return schema;
}
