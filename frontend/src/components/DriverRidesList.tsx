import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ScrollableSnapList from "./ScrollableSnapList";
import { Ride } from "../gql/graphql";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryDriverRides } from "../api/DriverRides";

const DriverRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const { isSm } = useBreakpoints();

  const getVariant = (ride: Ride): VariantType => {
    if (ride.is_canceled) return "cancel";
    const availableSeats = ride.max_passenger - (ride.nb_passenger ?? 0);
    if (availableSeats <= 0) return "full";

    const departureDate = new Date(ride.departure_at);
    const today = new Date();
    if (departureDate < today) return "validation";

    return "primary";
  };
  const { data: upcomingRidesData } = useQuery(queryDriverRides, {
    variables: { filter: "upcoming" },
  });
  const upcomingRides = upcomingRidesData?.driverRides;

  const { data: archivedRidesData } = useQuery(queryDriverRides, {
    variables: { filter: "archived" },
  });
  const archivedRides = archivedRidesData?.driverRides;

  return (
    <div className=" h-full w-full pt-4 pb-32 sm:pb-16 overflow-auto">
      <span
        className="flex items-center w-fit gap-2 ml-4  cursor-pointer"
        onClick={() => setShowUpcoming((prev) => !prev)}
      >
        {showUpcoming ? <ChevronUp /> : <ChevronDown />}
        Trajets à venir
      </span>
      {upcomingRides && upcomingRides?.length > 0 ? (
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
        <div className="text-center w-full mt-10">Aucun trajet à venir.</div>
      )}
      <span
        className="flex items-center w-fit gap-2 ml-4  cursor-pointer"
        onClick={() => setShowArchived((prev) => !prev)}
      >
        {showArchived ? <ChevronUp /> : <ChevronDown />}
        Trajets archivés
      </span>
      {archivedRides && archivedRides.length > 0 ? (
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
        <div className="text-center w-full mt-10 ">Aucun trajet archivé.</div>
      )}
    </div>
  );
};

export default DriverRidesList;
