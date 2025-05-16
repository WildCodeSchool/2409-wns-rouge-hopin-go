/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\nmutation CreatePassengerRide($data: CreatePassengerRideInput!) {\n    createPassengerRide(data: $data) {\n        user_id\n        ride_id \n    }\n  }": typeof types.CreatePassengerRideDocument,
    "\nmutation CreateRide($data: RideCreateInput!) {\n    createRide(data: $data) {\n      driver_id {\n        id\n        email\n      }\n      departure_city\n      arrival_city\n      departure_address\n      arrival_address\n      departure_at\n      arrival_at\n      max_passenger\n    }\n  }": typeof types.CreateRideDocument,
    "\nmutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      id\n      firstName\n      lastName\n      email\n    }\n  }": typeof types.CreateUserDocument,
    "\n  query PassengerRide($data: CreatePassengerRideInput!) {\n    passengerRide(data: $data) {\n        user_id\n        ride_id \n        status\n    }\n  }\n": typeof types.PassengerRideDocument,
    "\n  query PassengersByRide($ride_id: ID!) {\n    passengersByRide(ride_id: $ride_id) {\n      status\n      user {\n        id\n        firstName\n        lastName\n      }\n    }\n  }\n": typeof types.PassengersByRideDocument,
    "\n  query Ride($id: ID!) {\n    ride(id: $id) {\n      id\n      nb_passenger\n      max_passenger\n      driver_id {\n        id\n      }\n    }\n  }\n": typeof types.RideDocument,
    "\n  query SearchRides($data: SearchRideInput!) {\n    searchRide(data: $data) {\n      id\n      created_at\n      departure_city\n      departure_at\n      arrival_city\n      arrival_at\n      departure_address\n      arrival_address\n      departure_lng\n      departure_lat\n      arrival_lng\n      arrival_lat\n      max_passenger\n      nb_passenger\n      is_canceled\n      driver_id {\n        id\n        firstName\n        lastName\n        createdAt\n        role\n      }\n      passenger_status\n    }\n  }\n": typeof types.SearchRidesDocument,
    "\nmutation Signin($email: String!, $password: String! ) {\n  signin(email: $email, password: $password) {\n    id\n    email\n  }\n}": typeof types.SigninDocument,
    "\nmutation Mutation {\n  signout\n}\n  ": typeof types.MutationDocument,
    "\nquery Whoami {\n  whoami {\n    id\n    email\n    role\n  }\n}\n": typeof types.WhoamiDocument,
};
const documents: Documents = {
    "\nmutation CreatePassengerRide($data: CreatePassengerRideInput!) {\n    createPassengerRide(data: $data) {\n        user_id\n        ride_id \n    }\n  }": types.CreatePassengerRideDocument,
    "\nmutation CreateRide($data: RideCreateInput!) {\n    createRide(data: $data) {\n      driver_id {\n        id\n        email\n      }\n      departure_city\n      arrival_city\n      departure_address\n      arrival_address\n      departure_at\n      arrival_at\n      max_passenger\n    }\n  }": types.CreateRideDocument,
    "\nmutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      id\n      firstName\n      lastName\n      email\n    }\n  }": types.CreateUserDocument,
    "\n  query PassengerRide($data: CreatePassengerRideInput!) {\n    passengerRide(data: $data) {\n        user_id\n        ride_id \n        status\n    }\n  }\n": types.PassengerRideDocument,
    "\n  query PassengersByRide($ride_id: ID!) {\n    passengersByRide(ride_id: $ride_id) {\n      status\n      user {\n        id\n        firstName\n        lastName\n      }\n    }\n  }\n": types.PassengersByRideDocument,
    "\n  query Ride($id: ID!) {\n    ride(id: $id) {\n      id\n      nb_passenger\n      max_passenger\n      driver_id {\n        id\n      }\n    }\n  }\n": types.RideDocument,
    "\n  query SearchRides($data: SearchRideInput!) {\n    searchRide(data: $data) {\n      id\n      created_at\n      departure_city\n      departure_at\n      arrival_city\n      arrival_at\n      departure_address\n      arrival_address\n      departure_lng\n      departure_lat\n      arrival_lng\n      arrival_lat\n      max_passenger\n      nb_passenger\n      is_canceled\n      driver_id {\n        id\n        firstName\n        lastName\n        createdAt\n        role\n      }\n      passenger_status\n    }\n  }\n": types.SearchRidesDocument,
    "\nmutation Signin($email: String!, $password: String! ) {\n  signin(email: $email, password: $password) {\n    id\n    email\n  }\n}": types.SigninDocument,
    "\nmutation Mutation {\n  signout\n}\n  ": types.MutationDocument,
    "\nquery Whoami {\n  whoami {\n    id\n    email\n    role\n  }\n}\n": types.WhoamiDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation CreatePassengerRide($data: CreatePassengerRideInput!) {\n    createPassengerRide(data: $data) {\n        user_id\n        ride_id \n    }\n  }"): (typeof documents)["\nmutation CreatePassengerRide($data: CreatePassengerRideInput!) {\n    createPassengerRide(data: $data) {\n        user_id\n        ride_id \n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation CreateRide($data: RideCreateInput!) {\n    createRide(data: $data) {\n      driver_id {\n        id\n        email\n      }\n      departure_city\n      arrival_city\n      departure_address\n      arrival_address\n      departure_at\n      arrival_at\n      max_passenger\n    }\n  }"): (typeof documents)["\nmutation CreateRide($data: RideCreateInput!) {\n    createRide(data: $data) {\n      driver_id {\n        id\n        email\n      }\n      departure_city\n      arrival_city\n      departure_address\n      arrival_address\n      departure_at\n      arrival_at\n      max_passenger\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      id\n      firstName\n      lastName\n      email\n    }\n  }"): (typeof documents)["\nmutation CreateUser($data: UserCreateInput!) {\n    createUser(data: $data) {\n      id\n      firstName\n      lastName\n      email\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PassengerRide($data: CreatePassengerRideInput!) {\n    passengerRide(data: $data) {\n        user_id\n        ride_id \n        status\n    }\n  }\n"): (typeof documents)["\n  query PassengerRide($data: CreatePassengerRideInput!) {\n    passengerRide(data: $data) {\n        user_id\n        ride_id \n        status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PassengersByRide($ride_id: ID!) {\n    passengersByRide(ride_id: $ride_id) {\n      status\n      user {\n        id\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  query PassengersByRide($ride_id: ID!) {\n    passengersByRide(ride_id: $ride_id) {\n      status\n      user {\n        id\n        firstName\n        lastName\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Ride($id: ID!) {\n    ride(id: $id) {\n      id\n      nb_passenger\n      max_passenger\n      driver_id {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query Ride($id: ID!) {\n    ride(id: $id) {\n      id\n      nb_passenger\n      max_passenger\n      driver_id {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SearchRides($data: SearchRideInput!) {\n    searchRide(data: $data) {\n      id\n      created_at\n      departure_city\n      departure_at\n      arrival_city\n      arrival_at\n      departure_address\n      arrival_address\n      departure_lng\n      departure_lat\n      arrival_lng\n      arrival_lat\n      max_passenger\n      nb_passenger\n      is_canceled\n      driver_id {\n        id\n        firstName\n        lastName\n        createdAt\n        role\n      }\n      passenger_status\n    }\n  }\n"): (typeof documents)["\n  query SearchRides($data: SearchRideInput!) {\n    searchRide(data: $data) {\n      id\n      created_at\n      departure_city\n      departure_at\n      arrival_city\n      arrival_at\n      departure_address\n      arrival_address\n      departure_lng\n      departure_lat\n      arrival_lng\n      arrival_lat\n      max_passenger\n      nb_passenger\n      is_canceled\n      driver_id {\n        id\n        firstName\n        lastName\n        createdAt\n        role\n      }\n      passenger_status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation Signin($email: String!, $password: String! ) {\n  signin(email: $email, password: $password) {\n    id\n    email\n  }\n}"): (typeof documents)["\nmutation Signin($email: String!, $password: String! ) {\n  signin(email: $email, password: $password) {\n    id\n    email\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation Mutation {\n  signout\n}\n  "): (typeof documents)["\nmutation Mutation {\n  signout\n}\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery Whoami {\n  whoami {\n    id\n    email\n    role\n  }\n}\n"): (typeof documents)["\nquery Whoami {\n  whoami {\n    id\n    email\n    role\n  }\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;