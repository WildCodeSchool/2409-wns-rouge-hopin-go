import { useState } from "react";
import ScrollableSnapList from "./ScrollableSnapList";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryPassengerRides } from "../api/PassengerRides";
import { PassengerRidesQuery } from "../gql/graphql";

type SearchRide = PassengerRidesQuery["passengerRides"]["rides"][number];

const PassengerRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllArchived, setShowAllArchived] = useState(false);
  const { isSm, isMd, is2xl } = useBreakpoints();

  const { data: upcomingPassengerRidesData } = useQuery(queryPassengerRides, {
    variables: {
      filter: "upcoming",
      limit: showAllUpcoming ? 100 : 3,
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });
  const upcomingRides = upcomingPassengerRidesData?.passengerRides.rides ?? [];

  const { data: archivedPassengerRidesData } = useQuery(queryPassengerRides, {
    variables: {
      filter: "archived",
      limit: showAllArchived ? 100 : 3,
      offset: 0,
    },
  });
  const archivedRides = archivedPassengerRidesData?.passengerRides.rides ?? [];

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
      {upcomingRides.length > 0 ? (
        <>
          <span className="flex items-center w-fit gap-2 ml-4 cursor-pointer">
            Trajets à venir
          </span>

          <ScrollableSnapList
            dataset={upcomingRides}
            getVariant={getVariant}
            onSelect={setSelectedIndex}
            sliderDirection={isMd ? "horizontal" : "vertical"}
            slidePerView={is2xl ? 3 : isSm ? 2 : 3}
            swiperClassName={!isMd ? "h-full w-full" : ""}
            navigationArrows
            showPagination
          />

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

      {/* Trajets archivés */}
      {archivedRides.length > 0 ? (
        <>
          <span className="flex items-center w-fit gap-2 ml-4 cursor-pointer mt-6">
            Trajets archivés
          </span>

          <ScrollableSnapList
            dataset={archivedRides}
            getVariant={getVariant}
            onSelect={setSelectedIndex}
            sliderDirection={isMd ? "horizontal" : "vertical"}
            slidePerView={is2xl ? 3 : isSm ? 2 : 3}
            swiperClassName={!isMd ? "h-full w-full" : ""}
            navigationArrows
            showPagination
          />

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
        <div className="text-center w-full mt-10">Aucun trajet archivé.</div>
      )}
    </div>
  );
};

export default PassengerRidesList;
