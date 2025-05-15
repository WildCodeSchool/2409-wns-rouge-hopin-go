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

export type GroupedPassengerRides = {
  __typename?: 'GroupedPassengerRides';
  approved: Array<Ride>;
  waiting: Array<Ride>;
};

export type IdInput = {
  id: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPassengerRide: PassengerRide;
  createRide: Ride;
  createUser: User;
  deleteRide?: Maybe<Ride>;
  deleteUser?: Maybe<User>;
  signin?: Maybe<User>;
  signout: Scalars['Boolean']['output'];
  updateRide?: Maybe<Ride>;
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


export type MutationDeleteRideArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSigninArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateRideArgs = {
  data: RideUpdateInput;
  id: Scalars['ID']['input'];
};

export type PassengerRide = {
  __typename?: 'PassengerRide';
  ride_id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  user_id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  driverRides: Array<Ride>;
  passengerRidesGrouped: GroupedPassengerRides;
  ride: Ride;
  rides: Array<Ride>;
  searchRide: Array<Ride>;
  user: User;
  users: Array<User>;
  whoami?: Maybe<User>;
};


export type QueryDriverRidesArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPassengerRidesGroupedArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRideArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchRideArgs = {
  data: SearchRideInput;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Ride = {
  __typename?: 'Ride';
  arrival_address: Scalars['String']['output'];
  arrival_at: Scalars['DateTimeISO']['output'];
  arrival_city: Scalars['String']['output'];
  arrival_lat: Scalars['Float']['output'];
  arrival_lng: Scalars['Float']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  departure_address: Scalars['String']['output'];
  departure_at: Scalars['DateTimeISO']['output'];
  departure_city: Scalars['String']['output'];
  departure_lat: Scalars['Float']['output'];
  departure_lng: Scalars['Float']['output'];
  driver_id: User;
  id: Scalars['ID']['output'];
  is_canceled: Scalars['Boolean']['output'];
  max_passenger: Scalars['Float']['output'];
  nb_passenger: Scalars['Float']['output'];
};

export type RideCreateInput = {
  arrival_address: Scalars['String']['input'];
  arrival_at: Scalars['DateTimeISO']['input'];
  arrival_city: Scalars['String']['input'];
  arrival_lat: Scalars['Float']['input'];
  arrival_lng: Scalars['Float']['input'];
  departure_address: Scalars['String']['input'];
  departure_at: Scalars['DateTimeISO']['input'];
  departure_city: Scalars['String']['input'];
  departure_lat: Scalars['Float']['input'];
  departure_lng: Scalars['Float']['input'];
  driver_id: IdInput;
  max_passenger: Scalars['Float']['input'];
};

export type RideUpdateInput = {
  arrival_at: Scalars['String']['input'];
  departure_at: Scalars['String']['input'];
  is_canceled: Scalars['Boolean']['input'];
  max_passenger: Scalars['Float']['input'];
};

export type SearchRideInput = {
  arrival_city: Scalars['String']['input'];
  departure_at: Scalars['DateTimeISO']['input'];
  departure_city: Scalars['String']['input'];
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

export type CreatePassengerRideMutationVariables = Exact<{
  data: CreatePassengerRideInput;
}>;


export type CreatePassengerRideMutation = { __typename?: 'Mutation', createPassengerRide: { __typename?: 'PassengerRide', user_id: string, ride_id: string } };

export type CreateRideMutationVariables = Exact<{
  data: RideCreateInput;
}>;


export type CreateRideMutation = { __typename?: 'Mutation', createRide: { __typename?: 'Ride', departure_city: string, arrival_city: string, departure_address: string, arrival_address: string, departure_at: any, arrival_at: any, max_passenger: number, driver_id: { __typename?: 'User', id: string, email?: string | null } } };

export type CreateUserMutationVariables = Exact<{
  data: UserCreateInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email?: string | null } };

export type RideQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RideQuery = { __typename?: 'Query', ride: { __typename?: 'Ride', id: string, nb_passenger: number, max_passenger: number, driver_id: { __typename?: 'User', id: string } } };

export type SearchRidesQueryVariables = Exact<{
  data: SearchRideInput;
}>;


export type SearchRidesQuery = { __typename?: 'Query', searchRide: Array<{ __typename?: 'Ride', id: string, created_at: any, departure_city: string, departure_at: any, arrival_city: string, arrival_at: any, departure_address: string, arrival_address: string, departure_lng: number, departure_lat: number, arrival_lng: number, arrival_lat: number, max_passenger: number, nb_passenger: number, is_canceled: boolean, driver_id: { __typename?: 'User', id: string, firstName: string, lastName: string, createdAt: any, role: string } }> };

export type SigninMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SigninMutation = { __typename?: 'Mutation', signin?: { __typename?: 'User', id: string, email?: string | null } | null };

export type MutationMutationVariables = Exact<{ [key: string]: never; }>;


export type MutationMutation = { __typename?: 'Mutation', signout: boolean };

export type WhoamiQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoamiQuery = { __typename?: 'Query', whoami?: { __typename?: 'User', id: string, email?: string | null, role: string } | null };


export const CreatePassengerRideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePassengerRide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePassengerRideInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPassengerRide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"ride_id"}}]}}]}}]} as unknown as DocumentNode<CreatePassengerRideMutation, CreatePassengerRideMutationVariables>;
export const CreateRideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RideCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driver_id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"departure_city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_city"}},{"kind":"Field","name":{"kind":"Name","value":"departure_address"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_address"}},{"kind":"Field","name":{"kind":"Name","value":"departure_at"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_at"}},{"kind":"Field","name":{"kind":"Name","value":"max_passenger"}}]}}]}}]} as unknown as DocumentNode<CreateRideMutation, CreateRideMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const RideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Ride"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ride"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nb_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"max_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"driver_id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RideQuery, RideQueryVariables>;
export const SearchRidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchRides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchRideInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchRide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"departure_city"}},{"kind":"Field","name":{"kind":"Name","value":"departure_at"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_city"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_at"}},{"kind":"Field","name":{"kind":"Name","value":"departure_address"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_address"}},{"kind":"Field","name":{"kind":"Name","value":"departure_lng"}},{"kind":"Field","name":{"kind":"Name","value":"departure_lat"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_lng"}},{"kind":"Field","name":{"kind":"Name","value":"arrival_lat"}},{"kind":"Field","name":{"kind":"Name","value":"max_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"nb_passenger"}},{"kind":"Field","name":{"kind":"Name","value":"is_canceled"}},{"kind":"Field","name":{"kind":"Name","value":"driver_id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<SearchRidesQuery, SearchRidesQueryVariables>;
export const SigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<SigninMutation, SigninMutationVariables>;
export const MutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Mutation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signout"}}]}}]} as unknown as DocumentNode<MutationMutation, MutationMutationVariables>;
export const WhoamiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<WhoamiQuery, WhoamiQueryVariables>;