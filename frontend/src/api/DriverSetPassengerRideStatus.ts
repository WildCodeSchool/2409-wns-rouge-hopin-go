import { gql } from "@apollo/client";

export const mutationDriverSetPassengerRideStatus = gql(`
mutation DriverSetPassengerRideStatus($data: DriverSetPassengerRideStatusInput!) {
  driverSetPassengerRideStatus(data: $data) {
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
