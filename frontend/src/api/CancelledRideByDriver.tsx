import { gql } from "@apollo/client";

export const mutationCancelledRideByDriver = gql(`
mutation CancelRide($cancelRideId: ID!) {
  cancelRide(id: $cancelRideId) {
    id
  }
}`);
