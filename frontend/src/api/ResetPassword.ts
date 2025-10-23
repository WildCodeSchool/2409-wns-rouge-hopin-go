import { gql } from "../gql";

export const mutationResetPassword = gql(`
mutation ResetPassword($data: UserResetPasswordInput!) {
    resetPassword(data: $data)
  }`);
