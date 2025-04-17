import { gql } from "../gql";

export const querySearchRide = gql(`
  query SearchRides($data: SearchRideInput!) {
    searchRide(data: $data) {
      departure_city
      departure_at
      arrival_city
      arrival_at
      departure_address
      arrival_address
      departure_lng
      departure_lat
      arrival_lng
      arrival_lat
      max_passenger
      is_canceled
      driverId{
        id
        firstName
        lastName
        }
}
  }
`);
