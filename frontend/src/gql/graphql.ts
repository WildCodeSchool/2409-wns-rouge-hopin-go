/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
};

export type CreatePassengerRideInput = {
  ride_id: Scalars['ID']['input'];
  user_id: Scalars['ID']['input'];
};

export type DriverSetPassengerRideStatusInput = {
  ride_id: Scalars['ID']['input'];
  status: PassengerRideStatus;
  user_id: Scalars['ID']['input'];
};

export type IdInput = {
  id: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelRide: Ride;
  createPassengerRide: PassengerRide;
  createRide: Ride;
  createUser: User;
  deleteMyAccount: Scalars['Boolean']['output'];
  deleteRide?: Maybe<Ride>;
  driverSetPassengerRideStatus: PassengerRide;
  passengerWithdrawFromRide: PassengerRide;
  resetPassword: Scalars['Boolean']['output'];
  sendResetLink: Scalars['Boolean']['output'];
  signin?: Maybe<User>;
  signout: Scalars['Boolean']['output'];
  updateMyAccount?: Maybe<User>;
  verifyEmail: VerifyEmailResponse;
};


export type MutationCancelRideArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreatePassengerRideArgs = {
  data: CreatePassengerRideInput;
};


export type MutationCreateRideArgs = {
  data: RideCreateInput;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationDeleteMyAccountArgs = {
  currentPassword: Scalars['String']['input'];
};


export type MutationDeleteRideArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDriverSetPassengerRideStatusArgs = {
  data: DriverSetPassengerRideStatusInput;
};


export type MutationPassengerWithdrawFromRideArgs = {
  ride_id: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  data: UserResetPasswordInput;
};


export type MutationSendResetLinkArgs = {
  email: Scalars['String']['input'];
};


export type MutationSigninArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateMyAccountArgs = {
  data: UserUpdateInput;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type PaginatedRides = {
  __typename?: 'PaginatedRides';
  rides: Array<Ride>;
  totalCount: Scalars['Float']['output'];
};

export type PassengerRide = {
  __typename?: 'PassengerRide';
  ride: Ride;
  ride_id: Scalars['ID']['output'];
  status: PassengerRideStatus;
  user: User;
  user_id: Scalars['ID']['output'];
};

export enum PassengerRideStatus {
  Approved = 'APPROVED',
  CancelledByDriver = 'CANCELLED_BY_DRIVER',
  CancelledByPassenger = 'CANCELLED_BY_PASSENGER',
  Refused = 'REFUSED',
  Waiting = 'WAITING'
}

export type Point = {
  __typename?: 'Point';
  coordinates: Array<Scalars['Float']['output']>;
  type: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  driverRides: PaginatedRides;
  passengerRides: PaginatedRides;
  passengersByRide: Array<PassengerRide>;
  ride: Ride;
  rides: Array<Ride>;
  searchRide: Array<Ride>;
  users: Array<User>;
  whoami?: Maybe<User>;
};


export type QueryDriverRidesArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPassengerRidesArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPassengersByRideArgs = {
  ride_id: Scalars['ID']['input'];
};


export type QueryRideArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchRideArgs = {
  data: SearchRideInput;
};

export type Ride = {
  __typename?: 'Ride';
  arrival_address: Scalars['String']['output'];
  arrival_at: Scalars['DateTimeISO']['output'];
  arrival_city: Scalars['String']['output'];
  arrival_location: Point;
  available_seats: Scalars['Float']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  current_user_passenger_status?: Maybe<PassengerRideStatus>;
  departure_address: Scalars['String']['output'];
  departure_at: Scalars['DateTimeISO']['output'];
  departure_city: Scalars['String']['output'];
  departure_location: Point;
  distance_km?: Maybe<Scalars['Float']['output']>;
  driver: User;
  duration_min?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  is_cancelled: Scalars['Boolean']['output'];
  max_passenger: Scalars['Float']['output'];
  nb_passenger: Scalars['Float']['output'];
  passenger_rides?: Maybe<Array<PassengerRide>>;
  price_per_passenger?: Maybe<Scalars['Float']['output']>;
  route_polyline5?: Maybe<Scalars['String']['output']>;
  total_route_price?: Maybe<Scalars['Float']['output']>;
};

export type RideCreateInput = {
  arrival_address: Scalars['String']['input'];
  arrival_city: Scalars['String']['input'];
  arrival_lat: Scalars['Float']['input'];
  arrival_lng: Scalars['Float']['input'];
  departure_address: Scalars['String']['input'];
  departure_at: Scalars['DateTimeISO']['input'];
  departure_city: Scalars['String']['input'];
  departure_lat: Scalars['Float']['input'];
  departure_lng: Scalars['Float']['input'];
  driver: IdInput;
  max_passenger: Scalars['Float']['input'];
};

export type SearchRideInput = {
  arrival_city: Scalars['String']['input'];
  arrival_lat: Scalars['Float']['input'];
  arrival_lng: Scalars['Float']['input'];
  arrival_radius: Scalars['Float']['input'];
  departure_at: Scalars['DateTimeISO']['input'];
  departure_city: Scalars['String']['input'];
  departure_lat: Scalars['Float']['input'];
  departure_lng: Scalars['Float']['input'];
  departure_radius: Scalars['Float']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTimeISO']['output'];
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type UserCreateInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UserResetPasswordInput = {
  password: Scalars['String']['input'];
  resetToken: Scalars['String']['input'];
};

export type UserUpdateInput = {
  currentPassword?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type VerifyEmailResponse = {
  __typename?: 'VerifyEmailResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CreatePassengerRideMutationVariables = Exact<{
  data: CreatePassengerRideInput;
}>;


export type CreatePassengerRideMutation = { __typename?: 'Mutation', createPassengerRide: { __typename?: 'PassengerRide', user_id: string, ride_id: string } };

export type CreateRideMutationVariables = Exact<{
  data: RideCreateInput;
}>;


export type CreateRideMutation = { __typename?: 'Mutation', createRide: { __typename?: 'Ride', id: string, departure_city: string, arrival_city: string, departure_address: string, arrival_address: string, departure_at: any, arrival_at: any, max_passenger: number, distance_km?: number | null, duration_min?: number | null, route_polyline5?: string | null, driver: { __typename?: 'User', id: string, email?: string | null } } };

export type CreateUserMutationVariables = Exact<{
  data: UserCreateInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null } };

export type DeleteMyAccountMutationVariables = Exact<{
  currentPassword: Scalars['String']['input'];
}>;


export type DeleteMyAccountMutation = { __typename?: 'Mutation', deleteMyAccount: boolean };

export type DriverRidesQueryVariables = Exact<{
  filter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
}>;


export type DriverRidesQuery = { __typename?: 'Query', driverRides: { __typename?: 'PaginatedRides', totalCount: number, rides: Array<{ __typename?: 'Ride', id: string, current_user_passenger_status?: PassengerRideStatus | null, created_at: any, departure_address: string, departure_at: any, departure_city: string, arrival_address: string, arrival_at: any, arrival_city: string, is_cancelled: boolean, max_passenger: number, nb_passenger: number, available_seats: number, distance_km?: number | null, duration_min?: number | null, route_polyline5?: string | null, total_route_price?: number | null, price_per_passenger?: number | null, driver: { __typename?: 'User', id: string, firstName: string, lastName: string, createdAt: any, role: string }, departure_location: { __typename?: 'Point', type: string, coordinates: Array<number> }, arrival_location: { __typename?: 'Point', type: string, coordinates: Array<number> }, passenger_rides?: Array<{ __typename?: 'PassengerRide', ride_id: string, user_id: string, status: PassengerRideStatus }> | null }> } };

export type DriverSetPassengerRideStatusMutationVariables = Exact<{
  data: DriverSetPassengerRideStatusInput;
}>;


export type DriverSetPassengerRideStatusMutation = { __typename?: 'Mutation', driverSetPassengerRideStatus: { __typename?: 'PassengerRide', status: PassengerRideStatus, user: { __typename?: 'User', id: string }, ride: { __typename?: 'Ride', id: string } } };

export type PassengerRidesQueryVariables = Exact<{
  filter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
}>;


export type PassengerRidesQuery = { __typename?: 'Query', passengerRides: { __typename?: 'PaginatedRides', totalCount: number, rides: Array<{ __typename?: 'Ride', id: string, created_at: any, departure_address: string, departure_at: any, departure_city: string, arrival_address: string, arrival_at: any, arrival_city: string, is_cancelled: boolean, max_passenger: number, nb_passenger: number, available_seats: number, current_user_passenger_status?: PassengerRideStatus | null, distance_km?: number | null, duration_min?: number | null, route_polyline5?: string | null, total_route_price?: number | null, price_per_passenger?: number | null, driver: { __typename?: 'User', id: string, firstName: string, lastName: string, createdAt: any, role: string }, departure_location: { __typename?: 'Point', type: string, coordinates: Array<number> }, arrival_location: { __typename?: 'Point', type: string, coordinates: Array<number> }, passenger_rides?: Array<{ __typename?: 'PassengerRide', user_id: string, ride_id: string, status: PassengerRideStatus }> | null }> } };

export type PassengerWithdrawFromRideMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PassengerWithdrawFromRideMutation = { __typename?: 'Mutation', passengerWithdrawFromRide: { __typename?: 'PassengerRide', ride_id: string } };

export type PassengersByRideQueryVariables = Exact<{
  ride_id: Scalars['ID']['input'];
}>;


export type PassengersByRideQuery = { __typename?: 'Query', passengersByRide: Array<{ __typename?: 'PassengerRide', status: PassengerRideStatus, user: { __typename?: 'User', id: string, firstName: string, lastName: string } }> };

export type ResetPasswordMutationVariables = Exact<{
  data: UserResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type RideQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RideQuery = { __typename?: 'Query', ride: { __typename?: 'Ride', id: string, nb_passenger: number, max_passenger: number, distance_km?: number | null, duration_min?: number | null, route_polyline5?: string | null, departure_location: { __typename?: 'Point', type: string, coordinates: Array<number> }, arrival_location: { __typename?: 'Point', type: string, coordinates: Array<number> }, driver: { __typename?: 'User', id: string }, passenger_rides?: Array<{ __typename?: 'PassengerRide', user_id: string, ride_id: string, status: PassengerRideStatus }> | null } };

export type RidesQueryVariables = Exact<{ [key: string]: never; }>;


export type RidesQuery = { __typename?: 'Query', rides: Array<{ __typename?: 'Ride', id: string, created_at: any, departure_address: string, departure_at: any, departure_city: string, arrival_address: string, arrival_at: any, arrival_city: string, is_cancelled: boolean, max_passenger: number, nb_passenger: number, distance_km?: number | null, duration_min?: number | null, route_polyline5?: string | null, driver: { __typename?: 'User', id: string, firstName: string, lastName: string }, departure_location: { __typename?: 'Point', type: string, coordinates: Array<number> }, arrival_location: { __typename?: 'Point', type: string, coordinates: Array<number> } }> };

export type SearchRidesQueryVariables = Exact<{
  data: SearchRideInput;
}>;


export type SearchRidesQuery = { __typename?: 'Query', searchRide: Array<{ __typename?: 'Ride', id: string, created_at: any, departure_city: string, departure_at: any, distance_km?: number | null, duration_min?: number | null, route_polyline5?: string | null, total_route_price?: number | null, price_per_passenger?: number | null, arrival_city: string, arrival_at: any, departure_address: string, arrival_address: string, max_passenger: number, nb_passenger: number, is_cancelled: boolean, available_seats: number, current_user_passenger_status?: PassengerRideStatus | null, departure_location: { __typename?: 'Point', type: string, coordinates: Array<number> }, arrival_location: { __typename?: 'Point', type: string, coordinates: Array<number> }, driver: { __typename?: 'User', id: string, firstName: string, lastName: string, createdAt: any, role: string }, passenger_rides?: Array<{ __typename?: 'PassengerRide', ride_id: string, user_id: string, status: PassengerRideStatus }> | null }> };

export type SendResetLinkMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendResetLinkMutation = { __typename?: 'Mutation', sendResetLink: boolean };

export type SigninMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SigninMutation = { __typename?: 'Mutation', signin?: { __typename?: 'User', id: string, email?: string | null } | null };

export type MutationMutationVariables = Exact<{ [key: string]: never; }>;


export type MutationMutation = { __typename?: 'Mutation', signout: boolean };

export type UpdateMyAccountMutationVariables = Exact<{
  data: UserUpdateInput;
}>;


export type UpdateMyAccountMutation = { __typename?: 'Mutation', updateMyAccount?: { __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null, createdAt: any } | null };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'VerifyEmailResponse', success: boolean, message: string } };

export type WhoamiQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoamiQuery = { __typename?: 'Query', whoami?: { __typename?: 'User', id: string, email?: string | null, role: string, firstName: string } | null };


export const CreatePassengerRideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePassengerRide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePassengerRideInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPassengerRide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"ride_id"}}]}}]}}]} as unknown as DocumentNode<CreatePassengerRideMutation, CreatePassengerRideMutationVariables>;
export const CreateRideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RideCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"departure_city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_city"}},{"kind":"Field","name":{"kind":"Name","value":"departure_address"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_address"}},{"kind":"Field","name":{"kind":"Name","value":"departure_at"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_at"}},{"kind":"Field","name":{"kind":"Name","value":"max_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"distance_km"}},{"kind":"Field","name":{"kind":"Name","value":"duration_min"}},{"kind":"Field","name":{"kind":"Name","value":"route_polyline5"}}]}}]}}]} as unknown as DocumentNode<CreateRideMutation, CreateRideMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteMyAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMyAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMyAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currentPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentPassword"}}}]}]}}]} as unknown as DocumentNode<DeleteMyAccountMutation, DeleteMyAccountMutationVariables>;
export const DriverRidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DriverRides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driverRides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"rides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"current_user_passenger_status"}},{"kind":"Field","name":{"kind":"Name","value":"departure_location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"arrival_location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"departure_address"}},{"kind":"Field","name":{"kind":"Name","value":"departure_at"}},{"kind":"Field","name":{"kind":"Name","value":"departure_city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_address"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_at"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_city"}},{"kind":"Field","name":{"kind":"Name","value":"is_cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"max_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"nb_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"available_seats"}},{"kind":"Field","name":{"kind":"Name","value":"distance_km"}},{"kind":"Field","name":{"kind":"Name","value":"duration_min"}},{"kind":"Field","name":{"kind":"Name","value":"route_polyline5"}},{"kind":"Field","name":{"kind":"Name","value":"total_route_price"}},{"kind":"Field","name":{"kind":"Name","value":"price_per_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"passenger_rides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ride_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DriverRidesQuery, DriverRidesQueryVariables>;
export const DriverSetPassengerRideStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DriverSetPassengerRideStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DriverSetPassengerRideStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driverSetPassengerRideStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ride"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DriverSetPassengerRideStatusMutation, DriverSetPassengerRideStatusMutationVariables>;
export const PassengerRidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PassengerRides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passengerRides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"rides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"departure_location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"arrival_location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"departure_address"}},{"kind":"Field","name":{"kind":"Name","value":"departure_at"}},{"kind":"Field","name":{"kind":"Name","value":"departure_city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_address"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_at"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_city"}},{"kind":"Field","name":{"kind":"Name","value":"is_cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"max_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"nb_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"available_seats"}},{"kind":"Field","name":{"kind":"Name","value":"current_user_passenger_status"}},{"kind":"Field","name":{"kind":"Name","value":"distance_km"}},{"kind":"Field","name":{"kind":"Name","value":"duration_min"}},{"kind":"Field","name":{"kind":"Name","value":"route_polyline5"}},{"kind":"Field","name":{"kind":"Name","value":"total_route_price"}},{"kind":"Field","name":{"kind":"Name","value":"price_per_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"passenger_rides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"ride_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PassengerRidesQuery, PassengerRidesQueryVariables>;
export const PassengerWithdrawFromRideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"passengerWithdrawFromRide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passengerWithdrawFromRide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ride_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ride_id"}}]}}]}}]} as unknown as DocumentNode<PassengerWithdrawFromRideMutation, PassengerWithdrawFromRideMutationVariables>;
export const PassengersByRideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PassengersByRide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ride_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passengersByRide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ride_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ride_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<PassengersByRideQuery, PassengersByRideQueryVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserResetPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const RideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Ride"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ride"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nb_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"max_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"distance_km"}},{"kind":"Field","name":{"kind":"Name","value":"duration_min"}},{"kind":"Field","name":{"kind":"Name","value":"route_polyline5"}},{"kind":"Field","name":{"kind":"Name","value":"departure_location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"arrival_location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"driver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passenger_rides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"ride_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<RideQuery, RideQueryVariables>;
export const RidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Rides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"departure_location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"arrival_location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"departure_address"}},{"kind":"Field","name":{"kind":"Name","value":"departure_at"}},{"kind":"Field","name":{"kind":"Name","value":"departure_city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_address"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_at"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_city"}},{"kind":"Field","name":{"kind":"Name","value":"is_cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"max_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"nb_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"distance_km"}},{"kind":"Field","name":{"kind":"Name","value":"duration_min"}},{"kind":"Field","name":{"kind":"Name","value":"route_polyline5"}}]}}]}}]} as unknown as DocumentNode<RidesQuery, RidesQueryVariables>;
export const SearchRidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchRides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchRideInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchRide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"departure_city"}},{"kind":"Field","name":{"kind":"Name","value":"departure_at"}},{"kind":"Field","name":{"kind":"Name","value":"distance_km"}},{"kind":"Field","name":{"kind":"Name","value":"duration_min"}},{"kind":"Field","name":{"kind":"Name","value":"route_polyline5"}},{"kind":"Field","name":{"kind":"Name","value":"total_route_price"}},{"kind":"Field","name":{"kind":"Name","value":"price_per_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"departure_location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"arrival_city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_at"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"departure_address"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_address"}},{"kind":"Field","name":{"kind":"Name","value":"max_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"nb_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"is_cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"available_seats"}},{"kind":"Field","name":{"kind":"Name","value":"driver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passenger_rides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ride_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"current_user_passenger_status"}}]}}]}}]} as unknown as DocumentNode<SearchRidesQuery, SearchRidesQueryVariables>;
export const SendResetLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendResetLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendResetLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<SendResetLinkMutation, SendResetLinkMutationVariables>;
export const SigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<SigninMutation, SigninMutationVariables>;
export const MutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Mutation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signout"}}]}}]} as unknown as DocumentNode<MutationMutation, MutationMutationVariables>;
export const UpdateMyAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMyAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<UpdateMyAccountMutation, UpdateMyAccountMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const WhoamiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]} as unknown as DocumentNode<WhoamiQuery, WhoamiQueryVariables>;