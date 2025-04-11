import { gql } from "../gql";

export const mutationCreateRide = gql(`
mutation CreateRide($data: RideCreateInput!) {
    createRide(data: $data) {
      driver_id {
        id
        email
      }
      departure_city
      arrival_city
      departure_address
      arrival_address
      departure_at
      arrival_at
      max_passenger
      created_at
    }
  }`);