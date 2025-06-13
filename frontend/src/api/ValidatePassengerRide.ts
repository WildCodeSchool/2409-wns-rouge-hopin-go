import { gql } from "@apollo/client";

export const mutationValidatePassengerRide = gql(`
mutation ValidatePassengerRide($data: PassengerValidationInput!) {
  validatePassengerRide(data: $data) {
    user {
      id
      status
    }
    ride {
      id
    }
  }
}
`);
