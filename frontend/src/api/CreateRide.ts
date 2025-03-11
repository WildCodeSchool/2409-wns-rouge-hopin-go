import { gql } from "../gql";

export const mutationCreateRide = gql(`
mutation CreateRide($data: RideCreateInput!) {
    createRide(data: $data) {
      driver_id
      departure_city
      arrival_city
      departure_at
      arrival_at
      max_passenger
    }
  }`);