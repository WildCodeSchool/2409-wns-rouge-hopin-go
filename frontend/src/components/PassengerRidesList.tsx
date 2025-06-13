import { useState } from "react";
import ScrollableSnapList from "./ScrollableSnapList";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryPassengerRides } from "../api/PassengerRides";
import { SearchRidesQuery } from "../gql/graphql";

type SearchRide = SearchRidesQuery["searchRide"][number];

const PassengerRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllArchived, setShowAllArchived] = useState(false);

  const { isSm } = useBreakpoints();

  const { data: upcomingPassengerRidesData } = useQuery(queryPassengerRides, {
    variables: { filter: "upcoming" },
    fetchPolicy: "cache-and-network",
  });
  const upcomingRides = upcomingPassengerRidesData?.passengerRides ?? [];

  const { data: archivedPassengerRidesData } = useQuery(queryPassengerRides, {
    variables: { filter: "archived" },
  });
  const archivedRides = archivedPassengerRidesData?.passengerRides ?? [];

  const getVariant = (dataset: SearchRide): VariantType => {
    if (dataset.is_canceled) return "cancel";
    if (dataset.nb_passenger === dataset.max_passenger) return "full";
    if (dataset.passenger_status === "waiting") return "pending";
    if (dataset.passenger_status === "approved") return "validation";
    if (dataset.passenger_status === "refused") return "refused";
    return "primary";
  };

  return (
    <div className="h-full w-full pt-4 pb-32 sm:pb-16 overflow-auto bg-gray-100">
      {/* Trajets à venir */}
      {upcomingRides.length > 0 && (
        <>
          <span className="flex items-center w-fit gap-2 ml-8 cursor-pointer">
            Trajets à venir
          </span>

          <div className="flex h-fit w-full overflow-auto">
            <ScrollableSnapList
              dataset={
                showAllUpcoming ? upcomingRides : upcomingRides.slice(0, 3)
              }
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
      )}

      {/* Trajets archivés */}
      {archivedRides.length > 0 && (
        <>
          <span className="flex items-center w-fit gap-2 ml-8 cursor-pointer mt-6">
            Trajets archivés
          </span>

          <div className="flex h-fit w-full overflow-auto">
            <ScrollableSnapList
              dataset={
                showAllArchived ? archivedRides : archivedRides.slice(0, 3)
              }
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
      )}

      {/* Messages si aucune donnée */}
      {upcomingRides.length === 0 && (
        <div className="text-center w-full mt-10">Aucun trajet à venir.</div>
      )}
      {archivedRides.length === 0 && (
        <div className="text-center w-full mt-10">Aucun trajet archivé.</div>
      )}
    </div>
  );
};

export default PassengerRidesList;
