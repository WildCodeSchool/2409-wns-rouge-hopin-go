import { gql } from "@apollo/client";

export const mutationPassengerWithdrawFromRide = gql(`
mutation passengerWithdrawFromRide($id: ID!) {
  passengerWithdrawFromRide(ride_id: $id) {
    ride_id
  }
}`);
