import { gql } from "../gql";

export const mutationCreatePassengerRide = gql(`
mutation CreatePassengerRide($data: CreatePassengerRideInput!) {
    createPassengerRide(data: $data) {
        user_id
        ride_id 
    }
  }`);