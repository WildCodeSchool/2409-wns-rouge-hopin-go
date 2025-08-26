import { gql } from "../gql";

export const queryDriverRides = gql(`
  query DriverRides(
    $filter: String
    $limit: Int
    $offset: Int
    $sort: String
  ) {
    driverRides(
      filter: $filter
      limit: $limit
      offset: $offset
      sort: $sort
    ) {
      totalCount
      rides {
        id
        driver {
          id
          firstName
          lastName
          createdAt
          role
        }
        current_user_passenger_status
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
        available_seats
        distance_km
        duration_min
        route_polyline5
        passenger_rides {
          ride_id
          user_id
          status
        }
      }
    }
  }
`);
