import { gql } from "../gql";

export const queryWhoAmI = gql(`
query Whoami {
  whoami {
    id
    email
    role
  }
}
`);