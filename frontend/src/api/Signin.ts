import { gql } from "../gql";

export const mutationSignin = gql(`
mutation Signin($email: String!, $password: String! ) {
  signin(email: $email, password: $password) {
    id
    email
  }
}`);