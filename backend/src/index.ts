import "reflect-metadata";
import { datasource } from "./datasource";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { UsersResolver } from "./resolvers/Users";
import { authChecker, getUserFromContext } from "./auth";
import { User } from "./entities/User";
import { get } from "http";
import { getSchema } from "./schema";

async function initiliaze() {
  await datasource.initialize();
  console.info("Datasource is connected 🔌");

  const schema = await getSchema();

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
    context: async ({ req, res }) => {
      const context = {
        req,
        res,
        user: undefined as User | null | undefined,
      };

      const user = await getUserFromContext(context);

      context.user = user;
      return context;
    },
  });
  console.info(`GraphQL server ready at ${url}`);
}

initiliaze();
