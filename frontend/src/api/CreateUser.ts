import { gql } from "../gql";

export const mutationCreateUser = gql(`
mutation CreateUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      firstName
      lastName
      email
    }
  }`);
