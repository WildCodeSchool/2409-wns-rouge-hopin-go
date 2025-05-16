import { useState } from "react";
import ScrollableSnapList from "./ScrollableSnapList";
import { Ride } from "../gql/graphql";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryDriverRides } from "../api/DriverRides";

const DriverRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllArchived, setShowAllArchived] = useState(false);
  const { isSm } = useBreakpoints();

  const getVariant = (dataset: Ride): VariantType => {
    if (dataset.is_canceled) return "cancel";
    if (dataset.nb_passenger === dataset.max_passenger) return "validation";
    if (dataset.passenger_status === "waiting") return "pending";
    if (dataset.passenger_status === "approved") return "validation";
    if (dataset.passenger_status === "refused") return "refused";
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
    <div className=" h-full w-full pt-4 pb-32 sm:pb-16 overflow-auto bg-gray-100">
      <span className="flex items-center w-fit gap-2 ml-8  cursor-pointer">
        Trajets à venir
      </span>
      {upcomingRides && upcomingRides?.length > 0 ? (
        <>
          <div className="flex h-fit w-full overflow-auto">
            <ScrollableSnapList
              driverUpcomingRides
              dataset={upcomingRides}
              getVariant={getVariant}
              onSelect={setSelectedIndex}
              direction={isSm ? "horizontal" : "vertical"}
            />
          </div>
          {upcomingRides.length > 3 && (
            <div className="mr-4 mt-2 flex justify-end">
              <button
                onClick={() => setShowAllUpcoming((prev) => !prev)}
                className="text-primary underline"
              >
                {showAllUpcoming ? "Voir moins" : "Voir plus"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center w-full mt-10">Aucun trajet à venir.</div>
      )}
      <span className="flex items-center w-fit gap-2 ml-8  cursor-pointer">
        Trajets archivés
      </span>
      {archivedRides && archivedRides.length > 0 ? (
        <>
          <div className="flex h-fit w-full overflow-auto">
            <ScrollableSnapList
              dataset={archivedRides}
              getVariant={getVariant}
              onSelect={setSelectedIndex}
              direction={isSm ? "horizontal" : "vertical"}
            />
          </div>
          {archivedRides.length > 3 && (
            <div className="mr-4 mt-2 flex justify-end">
              <button
                onClick={() => setShowAllArchived((prev) => !prev)}
                className="text-primary underline"
              >
                {showAllArchived ? "Voir moins" : "Voir plus"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center w-full mt-10 ">Aucun trajet archivé.</div>
      )}
    </div>
  );
};

export default DriverRidesList;
