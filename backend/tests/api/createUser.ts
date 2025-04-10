export const mutationCreateUser = `#graphql
mutation CreateUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id      
    }
  }
  `;
