import { useState } from "react";
import ScrollableSnapList from "./ScrollableSnapList";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryDriverRides } from "../api/DriverRides";
import { SearchRidesQuery } from "../gql/graphql";

type SearchRide = SearchRidesQuery["searchRide"][number];

const DriverRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllArchived, setShowAllArchived] = useState(false);
  const { isMd } = useBreakpoints();

  const getVariant = (dataset: SearchRide): VariantType => {
    if (dataset.is_canceled) return "cancel";
    if (dataset.nb_passenger === dataset.max_passenger) return "validation";
    if (dataset.passenger_status === "waiting") return "pending";
    if (dataset.passenger_status === "approved") return "validation";
    if (dataset.passenger_status === "refused") return "refused";
    return "primary";
  };
  const { data: upcomingRidesData } = useQuery(queryDriverRides, {
    variables: {
      filter: "upcoming",
      limit: showAllUpcoming ? 100 : 3,
      offset: 0,
    },
  });
  const upcomingRides = upcomingRidesData?.driverRides;
  console.log("🚀 ~ DriverRidesList ~ upcomingRides:", upcomingRides);

  const { data: archivedRidesData } = useQuery(queryDriverRides, {
    variables: {
      filter: "archived",
      limit: 6,
      offset: 0,
    },
  });
  const archivedRides = archivedRidesData?.driverRides;
  console.log("🚀 ~ DriverRidesList ~ archivedRides:", archivedRides);

  return (
    <div className=" h-full w-full pt-4 pb-32 sm:pb-16 overflow-auto bg-gray-100">
      <span className="flex items-center w-fit gap-2 ml-8 cursor-pointer">
        Trajets à venir
      </span>
      {upcomingRides && upcomingRides.rides.length > 0 ? (
        <>
          <ScrollableSnapList
            driverUpcomingRides
            dataset={upcomingRides.rides}
            getVariant={getVariant}
            onSelect={setSelectedIndex}
            sliderDirection={isMd ? "horizontal" : "vertical"}
            slidePerView={2}
            swiperClassName={!isMd ? "h-full w-full" : ""}
          />
          {upcomingRides.rides.length >= 3 && (
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
      {archivedRides && archivedRides.rides.length > 0 ? (
        <>
          {/* <div className="flex h-fit w-full overflow-auto"> */}
          <ScrollableSnapList
            driverUpcomingRides
            dataset={archivedRides.rides}
            getVariant={getVariant}
            onSelect={setSelectedIndex}
            sliderDirection={isMd ? "horizontal" : "vertical"}
            slidePerView={2}
            swiperClassName={!isMd ? "h-full w-full" : ""}
          />
          {/* </div> */}
          {archivedRides.rides.length > 3 && (
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
