import { gql } from "../gql";

export const querySearchRide = gql(`
query SearchRide($data: SearchRideInput!) {
    searchRide(data: $data) {
      departure_city
      departure_at
      arrival_city
      arrival_at
    }}
  }
`);
