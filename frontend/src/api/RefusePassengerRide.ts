import { gql } from "@apollo/client";

export const mutationRefusePassengerRide = gql(`
mutation RefusePassengerRide($data: PassengerValidationInput!) {
  refusePassengerRide(data: $data) {
    user {
      id
    }
    ride {
      id
    }
  }
}
`);
