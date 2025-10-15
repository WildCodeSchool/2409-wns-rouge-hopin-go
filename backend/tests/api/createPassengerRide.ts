export const mutationCreatePassengerRide = `#graphql
mutation CreatePassengerRide($data: CreatePassengerRideInput!) {
    createPassengerRide(data: $data) {
        user_id
        ride_id 
    }
  }`