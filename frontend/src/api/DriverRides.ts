import { gql } from "../gql";

export const queryDriverRides = gql(`
  query DriverRides($filter: String) {
    driverRides(filter: $filter) {
      id
      driver_id {
        id
        firstName
        lastName
        createdAt
        role
      }
      created_at
      departure_address
      departure_at
      departure_city
      arrival_address
      arrival_at
      arrival_city
      is_canceled
      max_passenger
      nb_passenger
    }
  }
`);
