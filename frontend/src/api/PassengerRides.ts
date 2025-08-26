import { gql } from "../gql";

export const queryPassengerRides = gql(`
  query PassengerRides(
    $filter: String
    $limit: Int
    $offset: Int
    $sort: String
  ) {
    passengerRides(
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
        current_user_passenger_status
        distance_km
        duration_min
        route_polyline5
        passenger_rides {
          user_id
          ride_id
          status
        }
      }
    }
  }
`);
