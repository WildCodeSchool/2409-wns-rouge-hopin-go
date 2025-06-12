import { gql } from "../gql";

export const queryPassengerRides = gql(`
  query PassengerRides($filter: String) {
  passengerRides(filter: $filter) {
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
      passenger_rides{
        user_id
        ride_id 
        status
      }
      passenger_status
  }
}
`);
