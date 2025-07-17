import { useContext } from "react";
import RideContext, { RideContextType } from ".";

const useRideOptional = (): RideContextType | null => {
  return useContext(RideContext);
};

export default useRideOptional;
