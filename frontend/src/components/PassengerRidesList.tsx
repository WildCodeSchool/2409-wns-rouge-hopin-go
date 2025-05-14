import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ScrollableSnapList from "./ScrollableSnapList";
import { Ride } from "../gql/graphql";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PassengerRidesList = ({ dataset }: any) => {
  const [, setSelectedIndex] = useState(0);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const { isSm } = useBreakpoints();

  const getVariant = (ride: Ride): VariantType => {
    if (ride.is_canceled) return "cancel";
    const availableSeats = ride.max_passenger - (ride.nb_passenger ?? 0);
    if (availableSeats <= 0) return "error";

    const departureDate = new Date(ride.departure_at);
    const today = new Date();
    if (departureDate < today) return "validation";

    return "primary";
  };

  const upcomingRides = dataset.filter(
    (ride) => new Date(ride.departure_at) >= new Date() && !ride.is_canceled
  );

  const archivedRides = dataset.filter(
    (ride) => new Date(ride.departure_at) < new Date()
  );

  return (
    <div className=" h-full w-full pt-4 pb-16 overflow-auto">
      <span
        className="flex items-center gap-2 ml-4 text-white cursor-pointer"
        onClick={() => setShowUpcoming((prev) => !prev)}
      >
        {showUpcoming ? (
          <ChevronUp color="white" />
        ) : (
          <ChevronDown color="white" />
        )}
        Trajets à venir
      </span>
      {upcomingRides.length > 0 ? (
        showUpcoming && (
          <div className="flex h-fit w-full overflow-auto">
            <ScrollableSnapList
              dataset={upcomingRides}
              getVariant={getVariant}
              onSelect={setSelectedIndex}
              direction={isSm ? "horizontal" : "vertical"}
            />
          </div>
        )
      ) : (
        <div className="text-center w-full mt-10 text-textLight">
          Aucun trajet à venir.
        </div>
      )}
      <span
        className="flex items-center gap-2 ml-4 text-white cursor-pointer"
        onClick={() => setShowArchived((prev) => !prev)}
      >
        {showArchived ? (
          <ChevronUp color="white" />
        ) : (
          <ChevronDown color="white" />
        )}
        Trajets archivés
      </span>
      {archivedRides.length > 0 ? (
        showArchived && (
          <div className="flex h-fit w-full overflow-auto">
            <ScrollableSnapList
              dataset={archivedRides}
              getVariant={getVariant}
              onSelect={setSelectedIndex}
              direction={isSm ? "horizontal" : "vertical"}
            />
          </div>
        )
      ) : (
        <div className="text-center w-full mt-10 text-textLight">
          Aucun trajet archivé.
        </div>
      )}
    </div>
  );
};

export default PassengerRidesList;
