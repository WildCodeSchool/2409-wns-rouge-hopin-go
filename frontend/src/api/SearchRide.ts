import { gql } from "../gql";

export const querySearchRide = gql(`
  query SearchRides($data: SearchRideInput!) {
    searchRide(data: $data) {
      id
      created_at
      departure_city
      departure_at
      arrival_city
      arrival_at
      departure_address
      arrival_address
      max_passenger
      nb_passenger
      is_canceled
      driver_id {
        id
        firstName
        lastName
        createdAt
        role
      }
      passenger_rides {
        ride_id
        user_id
        status
      }
      passenger_status
    }
  }
`);
