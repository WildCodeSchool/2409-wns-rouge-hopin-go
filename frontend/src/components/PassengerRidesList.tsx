import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ScrollableSnapList from "./ScrollableSnapList";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryPassengerRides } from "../api/PassengerRides";
import { Ride } from "../gql/graphql";

const PassengerRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const { isSm } = useBreakpoints();

  const { data: upcomingPassengerRidesData } = useQuery(queryPassengerRides, {
    variables: { filter: "upcoming" },
  });
  const upcomingRides = upcomingPassengerRidesData?.passengerRides;
  console.log("🚀 ~ PassengerRidesList ~ upcomingRides:", upcomingRides);

  const { data: archivedPassengerRidesData } = useQuery(queryPassengerRides, {
    variables: { filter: "archived" },
  });
  const archivedRides = archivedPassengerRidesData?.passengerRides;
  //  | "primary"
  //   | "secondary"
  //   | "validation"
  //   | "pending"
  //   | "full"
  //   | "cancel"
  //   | "refused";
  const getVariant = (dataset: Ride): VariantType => {
    if (dataset.is_canceled) return "cancel";
    if (dataset.nb_passenger === dataset.max_passenger) return "full";

    if (dataset.passenger_status === "waiting") return "pending";
    if (dataset.passenger_status === "approved") return "validation";
    if (dataset.passenger_status === "refused") return "refused";
    return "primary";
  };

  return (
    <div className=" h-full w-full pt-4 pb-32 sm:pb-16 overflow-auto  bg-gray-100 ">
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
          <div className="flex h-fit w-full overflow-auto ">
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

export default PassengerRidesList;
