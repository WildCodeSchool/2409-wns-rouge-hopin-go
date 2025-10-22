import { gql } from "../gql";

export const mutationVerifyEmail = gql(`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`);
