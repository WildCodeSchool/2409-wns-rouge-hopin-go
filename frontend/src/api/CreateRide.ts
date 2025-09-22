import { gql } from "../gql";

export const mutationCreateRide = gql(`
mutation CreateRide($data: RideCreateInput!) {
    createRide(data: $data) {
      id
      driver {
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
      distance_km
      duration_min
      route_polyline5
    }
  }`);
