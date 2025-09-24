import { useEffect, useState } from "react";
import ScrollableSnapList from "./ScrollableSnapList";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryDriverRides } from "../api/DriverRides";
import { DriverRidesQuery } from "../gql/graphql";

type DriverRide = DriverRidesQuery["driverRides"]["rides"][number];
const DriverRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [upcomingOffset, setUpcomingOffset] = useState(0);
  const [upcomingList, setUpcomingList] = useState<DriverRide[]>([]);
  const [archivedOffset, setArchivedOffset] = useState(0);
  const [archivedList, setArchivedList] = useState<DriverRide[]>([]);
  const limit = 3;

  const { isSm, isMd, is2xl } = useBreakpoints();

  const getVariant = (dataset: DriverRide): VariantType => {
    if (dataset.is_cancelled) return "cancel";
    if (dataset.nb_passenger === dataset.max_passenger) return "validation";
    return "primary";
  };

  // Upcoming
  const { data: upcomingRidesData } = useQuery(queryDriverRides, {
    variables: { filter: "upcoming", limit, offset: upcomingOffset },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const newRides = upcomingRidesData?.driverRides?.rides || [];
    setUpcomingList((prev) => {
      if (upcomingOffset === 0) return newRides;
      const before = prev.slice(0, upcomingOffset);
      return [...before, ...newRides];
    });
  }, [upcomingRidesData, upcomingOffset]);

  const totalUpcoming = upcomingRidesData?.driverRides?.totalCount || 0;

  // Archived
  const { data: archivedRidesData } = useQuery(queryDriverRides, {
    variables: { filter: "archived", limit, offset: archivedOffset },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const newRides = archivedRidesData?.driverRides?.rides || [];
    setArchivedList((prev) => {
      if (archivedOffset === 0) return newRides;
      const before = prev.slice(0, archivedOffset);
      return [...before, ...newRides];
    });
  }, [archivedRidesData, archivedOffset]);

  const totalArchived = archivedRidesData?.driverRides?.totalCount || 0;

  return (
    <div className="h-full w-full flex flex-col sm:pb-16 overflow-auto bg-gray-100">
      <div className=" h-full flex flex-col my-2 gap-4 sm:gap-0">
        <span className="ml-4">Trajets à venir</span>
        {upcomingList.length > 0 ? (
          <>
            <ScrollableSnapList
              driverUpcomingRides
              dataset={upcomingList}
              getVariant={getVariant}
              onSelect={setSelectedIndex}
              sliderDirection={isMd ? "horizontal" : "vertical"}
              slidePerView={is2xl ? 3 : isSm ? 2 : 3}
              swiperClassName={!isMd ? "h-full w-full" : ""}
              navigationArrows={isMd ? true : false}
              showPagination={isMd ? true : false}
              spaceBetween={isMd ? 0 : 50}
            />
            {totalUpcoming > upcomingList.length ? (
              <div className="mr-4 mt-2 flex justify-end">
                <button
                  onClick={() => setUpcomingOffset((prev) => prev + limit)}
                  className="text-primary underline"
                >
                  Voir plus
                </button>
              </div>
            ) : upcomingList.length > 3 ? (
              <div className="mr-4 mt-2 flex justify-end">
                <button
                  onClick={() => {
                    setUpcomingList([]);
                    setUpcomingOffset(0);
                  }}
                  className="text-primary underline"
                >
                  Voir moins
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center w-full mt-10">Aucun trajet à venir.</div>
        )}
      </div>
      <div className=" h-full flex flex-col my-20 sm:my-0 gap-4 sm:gap-0">
        <span className="ml-4">Trajets archivés</span>
        {archivedList.length > 0 ? (
          <>
            <ScrollableSnapList
              driverUpcomingRides
              dataset={archivedList}
              getVariant={getVariant}
              onSelect={setSelectedIndex}
              sliderDirection={isMd ? "horizontal" : "vertical"}
              slidePerView={is2xl ? 3 : isSm ? 2 : 3}
              swiperClassName={!isMd ? "h-full w-full" : ""}
              navigationArrows
              showPagination
            />
            {totalArchived > archivedList.length ? (
              <div className="mr-4 mt-2 flex justify-end">
                <button
                  onClick={() => setArchivedOffset((prev) => prev + limit)}
                  className="text-primary underline"
                >
                  Voir plus
                </button>
              </div>
            ) : archivedList.length > limit ? (
              <div className="mr-4 mt-2 flex justify-end">
                <button
                  onClick={() => {
                    setArchivedList([]);
                    setArchivedOffset(0);
                  }}
                  className="text-primary underline"
                >
                  Voir moins
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center w-full mt-10">Aucun trajet archivé.</div>
        )}
      </div>
    </div>
  );
};

export default DriverRidesList;
