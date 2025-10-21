// api/UpdateMyAccount.ts
import { gql } from "../gql"; // ton helper actuel
import type { TypedDocumentNode } from "@apollo/client";
import type {
  UpdateMyAccountMutation,
  UpdateMyAccountMutationVariables,
} from "../gql/graphql";

export const mutationUpdateMyAccount = gql(`
    mutation UpdateMyAccount($data: UserUpdateInput!) {
      updateMyAccount(data: $data) {
        id
        firstName
        lastName
        email
        createdAt
      }
    }
  `) as TypedDocumentNode<
  UpdateMyAccountMutation,
  UpdateMyAccountMutationVariables
>;
