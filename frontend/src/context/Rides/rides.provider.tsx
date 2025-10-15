import { ReactNode } from "react";
import RideContext, { RideContextType } from ".";

const RideProvider = ({ ride, children }: { ride: RideContextType; children: ReactNode }) => {
  return <RideContext.Provider value={ride}>{children}</RideContext.Provider>;
};

export default RideProvider;
