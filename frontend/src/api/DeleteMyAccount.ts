import { gql } from "@apollo/client";

export const DeleteMyAccount = gql`
  mutation DeleteMyAccount($currentPassword: String!) {
    deleteMyAccount(currentPassword: $currentPassword)
  }
`;
