import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ScrollableSnapList from "./ScrollableSnapList";
import { Ride } from "../gql/graphql";
import { VariantType } from "../types/variantTypes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PassengerRidesList = ({ dataset }: any) => {
  const [, setSelectedIndex] = useState(0);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const getVariant = (ride: Ride): VariantType => {
    if (ride.is_canceled) return "cancel";
    const availableSeats = ride.max_passenger - (ride.nb_passenger ?? 0);
    if (availableSeats <= 0) return "error";

    const departureDate = new Date(ride.departure_at);
    const today = new Date();
    if (departureDate < today) return "validation";

    return "primary";
  };

  return (
    <div className="flex flex-col gap-4">
      <span
        className="flex items-center gap-2 text-white cursor-pointer"
        onClick={() => setShowUpcoming((prev) => !prev)}
      >
        {showUpcoming ? (
          <ChevronUp color="white" />
        ) : (
          <ChevronDown color="white" />
        )}
        Trajets à venir
      </span>
      {showUpcoming && (
        <div className="flex h-full w-full z-20  overflow-hidden">
          <ScrollableSnapList
            dataset={dataset.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (ride: any) =>
                new Date(ride.departure_at) >= new Date() && !ride.is_canceled
            )}
            getVariant={getVariant}
            onSelect={setSelectedIndex}
            direction="horizontal"
          />
        </div>
      )}
      <span
        className="flex items-center gap-2 text-white cursor-pointer"
        onClick={() => setShowArchived((prev) => !prev)}
      >
        {showArchived ? (
          <ChevronUp color="white" />
        ) : (
          <ChevronDown color="white" />
        )}
        Trajets archivés
      </span>
      {showArchived && (
        <div className="flex h-full w-full z-20  overflow-hidden">
          <ScrollableSnapList
            dataset={dataset.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (ride: any) => new Date(ride.departure_at) < new Date()
            )}
            getVariant={getVariant}
            onSelect={setSelectedIndex}
            direction="horizontal"
          />
        </div>
      )}
    </div>
  );
};

export default PassengerRidesList;
