import { gql } from "../gql";

export const mutationSendResetLink = gql(`
mutation SendResetLink($email: String!) {
    sendResetLink(email: $email)
  }`);
