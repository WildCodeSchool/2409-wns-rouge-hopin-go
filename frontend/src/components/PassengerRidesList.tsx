import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ScrollableSnapList from "./ScrollableSnapList";
import { Ride } from "../gql/graphql";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryPassengerRides } from "../api/PassengerRides";

const PassengerRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const { isSm } = useBreakpoints();

  const { data: upcomingPassengerRidesData } = useQuery(queryPassengerRides, {
    variables: { filter: "upcoming" },
  });
  const upcomingRides = upcomingPassengerRidesData?.passengerRidesGrouped;
  console.log("🚀 ~ PassengerRidesList ~ upcomingRides:", upcomingRides);

  const { data: archivedPassengerRidesData } = useQuery(queryPassengerRides, {
    variables: { filter: "archived" },
  });
  const archivedRides = archivedPassengerRidesData?.passengerRidesGrouped;
  // "primary" | "secondary" | "validation" | "pending" | "full" | "cancel"
  const getVariant = (dataset: Ride): VariantType => {
    if (dataset.is_canceled) return "cancel";
    if (dataset.nb_passenger === dataset.max_passenger) return "full";
    if (upcomingRides?.waiting) return "pending";
    if (upcomingRides?.approved) return "validation";
    return "primary";
  };

  return (
    <div className=" h-full w-full pt-4 pb-32 sm:pb-16 overflow-auto">
      <span
        className="flex items-center w-fit gap-2 ml-4  cursor-pointer"
        onClick={() => setShowUpcoming((prev) => !prev)}
      >
        {showUpcoming ? <ChevronUp /> : <ChevronDown />}
        Trajets à venir
      </span>
      {upcomingRides ? (
        showUpcoming && (
          <div className="flex h-fit w-full overflow-auto">
            <ScrollableSnapList
              dataset={upcomingRides.waiting}
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
      {archivedRides && archivedRides.approved.length > 0 ? (
        showArchived && (
          <div className="flex h-fit w-full overflow-auto">
            <ScrollableSnapList
              dataset={archivedRides.approved}
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

export default PassengerRidesList;
