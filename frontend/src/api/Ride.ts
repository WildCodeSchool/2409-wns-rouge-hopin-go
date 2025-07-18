import { gql } from "../gql";

export const queryRide = gql(`
  query Ride($id: ID!) {
    ride(id: $id) {
      id
      nb_passenger
      max_passenger
      departure_location {
        type
        coordinates
      }
     arrival_location {
        type
        coordinates
      }
      driver {
        id
      }
      passenger_rides{
        user_id
        ride_id
        status
      }
    }
  }
`);
