import { DriverRidesQuery, PassengerRidesQuery, SearchRidesQuery } from "../../gql/graphql";
import { createContext } from "react";

type SearchRide = SearchRidesQuery["searchRides"][number];
type PassengerRide = PassengerRidesQuery["passengerRides"]["rides"][number];
type DriverRide = DriverRidesQuery["driverRides"]["rides"][number];

export type RideContextType = SearchRide | PassengerRide | DriverRide;
const RideContext = createContext<RideContextType | null>(null);
export default RideContext;
