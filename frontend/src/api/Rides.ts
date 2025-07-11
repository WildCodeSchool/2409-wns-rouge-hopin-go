import { gql } from "../gql";

export const queryRides = gql(`
query Rides {
  rides {
    id
    driver_id {
      id
      firstName
      lastName
    }
     departure_location {
        type
        coordinates
      }
     arrival_location {
        type
        coordinates
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
