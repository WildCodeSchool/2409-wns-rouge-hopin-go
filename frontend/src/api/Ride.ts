import { gql } from "../gql";

export const queryRide = gql(`
  query Ride($id: ID!) {
    ride(id: $id) {
      id
      nb_passenger
      max_passenger
      driver_id {
        id
      }
    }
  }
`);
