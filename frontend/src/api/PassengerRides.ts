import { gql } from "../gql";

export const queryPassengerRides = gql(`
  query PassengerRidesGrouped($filter: String) {
  passengerRidesGrouped(filter: $filter) {
    approved {
       id
      driver_id {
        id
        firstName
        lastName
        email
        role
        createdAt
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
    waiting {
      id
      driver_id {
        id
        firstName
        lastName
        email
        role
        createdAt
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
}

`);
