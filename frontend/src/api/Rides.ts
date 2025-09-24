import { gql } from "../gql";

export const queryRides = gql(`
query Rides {
  rides {
    id
    driver {
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
    is_cancelled
    max_passenger
    nb_passenger
    distance_km
    duration_min
    route_polyline5
  }
}
`);
