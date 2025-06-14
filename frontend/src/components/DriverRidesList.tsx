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
  const [upcomingOffset, setUpcomingOffset] = useState(0);
  console.log("🚀 ~ DriverRidesList ~ upcomingOffset:", upcomingOffset);
  const [archivedOffset, setArchivedOffset] = useState(0);
  const limit = 3;

  const { isSm, isMd, is2xl } = useBreakpoints();

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
      limit: limit,
      offset: upcomingOffset,
    },
  });
  const upcomingRides = upcomingRidesData?.driverRides;

  const { data: archivedRidesData } = useQuery(queryDriverRides, {
    variables: {
      filter: "archived",
      limit: limit,
      offset: archivedOffset,
    },
  });
  const archivedRides = archivedRidesData?.driverRides;

  return (
    <div className=" h-full w-full pt-4 pb-32 sm:pb-16 overflow-auto bg-gray-100">
      <span className="flex items-center w-fit gap-2 ml-4 cursor-pointer">
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
            slidePerView={is2xl ? 3 : isSm ? 2 : 3}
            swiperClassName={!isMd ? "h-full w-full" : ""}
            navigationArrows
            showPagination
          />
          {upcomingRides.totalCount > upcomingRides.rides.length && (
            <div className="mr-4 mt-2 flex justify-end">
              <button
                onClick={() => setUpcomingOffset((prev) => prev + limit)}
                className="text-primary underline"
              >
                Voir plus
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center w-full mt-10">Aucun trajet à venir.</div>
      )}
      <span className="flex items-center w-fit gap-2 ml-4  cursor-pointer">
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
            slidePerView={is2xl ? 3 : isSm ? 2 : 3}
            swiperClassName={!isMd ? "h-full w-full" : ""}
            navigationArrows
            showPagination
          />
          {/* </div> */}
          {archivedRides &&
            archivedRides.totalCount > archivedRides.rides.length && (
              <div className="mr-4 mt-2 flex justify-end">
                <button
                  onClick={() => setArchivedOffset((prev) => prev + limit)}
                  className="text-primary underline"
                >
                  Voir plus
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
