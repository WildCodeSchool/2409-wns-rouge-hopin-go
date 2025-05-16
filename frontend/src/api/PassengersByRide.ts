import { gql } from "@apollo/client";

export const queryPassengersByRide = gql(`
  query PassengersByRide($ride_id: ID!) {
    passengersByRide(ride_id: $ride_id) {
      status
      user {
        id
        firstName
        lastName
      }
    }
  }
`);
