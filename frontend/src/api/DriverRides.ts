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
        driver_id {
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
        is_canceled
        max_passenger
        nb_passenger
        passenger_rides {
          ride_id
          user_id
          status
        }
      }
    }
  }
`);
