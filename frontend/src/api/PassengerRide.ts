import { gql } from "../gql";

export const queryPassengerRide = gql(`
  query PassengerRide($data: CreatePassengerRideInput!) {
    passengerRide(data: $data) {
        user_id
        ride_id 
        status
    }
  }
`);