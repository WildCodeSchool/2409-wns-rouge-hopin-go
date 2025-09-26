// api/DeleteMyAccount.ts
import { gql } from "../gql";
export const DeleteMyAccount = gql(`
  mutation DeleteMyAccount { deleteMyAccount }
`);
