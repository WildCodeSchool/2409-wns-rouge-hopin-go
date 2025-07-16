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
        available_seats
        passenger_rides {
          user_id
          ride_id
          status
        }
      }
    }
  }
`);
