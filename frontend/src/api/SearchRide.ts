import { gql } from "../gql";

export const querySearchRide = gql(`
  query SearchRides($data: SearchRideInput!) {
    searchRide(data: $data) {
      departure_city
      departure_at
      arrival_city
    }
  }
`);
