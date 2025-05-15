import { gql } from "../gql";

export const queryPassengersByRide = gql(`
  query PassengersByRide($rideId: ID!) {
    passengersByRide(rideId: $rideId) {
      id
      status
      user {
        id
        firstName
        lastName
      }
    }
  }
`);
