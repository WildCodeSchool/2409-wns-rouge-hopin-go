import { TypedDocumentNode } from "@apollo/client";
import { SearchRidesQuery, SearchRidesQueryVariables } from "../gql/graphql";
import { gql } from "../gql";

export const querySearchRide = gql(`
  query SearchRides($data: SearchRideInput!) {
    searchRide(data: $data) {
      id
      created_at
      departure_city
      departure_at     
      departure_location {
        type
        coordinates
      }
      arrival_city
      arrival_at
      arrival_location {
        type
        coordinates
      }
      departure_address
      arrival_address
      max_passenger
      nb_passenger
      is_cancelled
      available_seats
      driver_id {
        id
        firstName
        lastName
        createdAt
        role
      }
      passenger_rides {
        ride_id
        user_id
        status
      }
      current_user_passenger_status
    }
  }
`) as TypedDocumentNode<SearchRidesQuery, SearchRidesQueryVariables>;
