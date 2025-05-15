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
    created_at
    departure_address
    departure_at
    departure_city
    departure_lat
    departure_lng
    arrival_address
    arrival_at
    arrival_city
    arrival_lat
    arrival_lng
    is_canceled
    max_passenger
    nb_passenger
  }
}
`);
