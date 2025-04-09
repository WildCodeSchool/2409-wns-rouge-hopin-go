import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import { UsersResolver } from "./resolvers/Users";

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [UsersResolver],
    validate: true,
    authChecker,
  });
  return schema;
}
