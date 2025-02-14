import { gql } from "../gql";

export const mutationSignout = gql(`
mutation Mutation {
  signout
}
  `);