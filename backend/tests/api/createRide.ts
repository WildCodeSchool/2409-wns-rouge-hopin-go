export const mutationCreateRide = `#graphql
mutation CreateRide($data: RideCreateInput!) {
    createRide(data: $data) {
      id      
    }
  }
  `;
