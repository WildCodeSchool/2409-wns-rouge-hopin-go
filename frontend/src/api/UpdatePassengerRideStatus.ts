import { gql } from "@apollo/client";

export const mutationUpdatePassengerRideStatus = gql(`
mutation UpdatePassengerRideStatus($data: UpdatePassengerRideStatusInput!) {
  updatePassengerRideStatus(data: $data) {
    user {
      id
    }
    ride {
      id
    }
    status
  }
}
`);
