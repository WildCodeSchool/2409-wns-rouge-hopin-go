import { useContext } from "react";
import RideContext from ".";

const useRide = () => {
  const ride = useContext(RideContext);
  if (!ride) {
    throw new Error("useRides must be used within a RidesProvider");
  }
  return ride;
};

export default useRide;
