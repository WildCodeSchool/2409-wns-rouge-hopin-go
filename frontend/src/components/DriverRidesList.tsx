import { useEffect, useState } from "react";
import ScrollableSnapList from "./ScrollableSnapList";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryDriverRides } from "../api/DriverRides";
import {
  DriverRidesQuery,
  PassengerRidesQuery,
  PassengerRideStatus,
} from "../gql/graphql";

type PassengerRide = PassengerRidesQuery["passengerRides"]["rides"][number];
type DriverRide = DriverRidesQuery["driverRides"]["rides"][number];
const DriverRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [upcomingOffset, setUpcomingOffset] = useState(0);
  const [upcomingList, setUpcomingList] = useState<DriverRide[]>([]);
  const [archivedOffset, setArchivedOffset] = useState(0);
  const [archivedList, setArchivedList] = useState<DriverRide[]>([]);
  const limit = 3;

  const { isSm, isMd, isLg, is2xl } = useBreakpoints();

  const getVariant = (dataset: PassengerRide): VariantType => {
    if (dataset.is_canceled) return "cancel";
    if (dataset.nb_passenger === dataset.max_passenger) return "validation";
    if (dataset.passenger_status === PassengerRideStatus.Waiting)
      return "pending";
    if (dataset.passenger_status === PassengerRideStatus.Approved)
      return "validation";
    if (dataset.passenger_status === PassengerRideStatus.Refused)
      return "refused";
    return "primary";
  };

  // Upcoming
  const { data: upcomingRidesData } = useQuery(queryDriverRides, {
    variables: { filter: "upcoming", limit, offset: upcomingOffset },
  });

  useEffect(() => {
    const rides = upcomingRidesData?.driverRides?.rides || [];
    setUpcomingList(rides);
  }, [upcomingRidesData]);

  const totalUpcoming = upcomingRidesData?.driverRides?.totalCount || 0;

  // Archived
  const { data: archivedRidesData } = useQuery(queryDriverRides, {
    variables: { filter: "archived", limit, offset: archivedOffset },
    onCompleted: (data) => {
      const newRides = data?.driverRides?.rides || [];
      setArchivedList((prev) => [...prev, ...newRides]);
    },
  });

  const totalArchived = archivedRidesData?.driverRides?.totalCount || 0;

  return (
    <div className="h-full w-full pt-4 pb-32 sm:pb-16 overflow-auto bg-gray-100">
      <span className="flex items-center w-fit gap-2 ml-4 cursor-pointer">
        Trajets à venir
      </span>
      {upcomingList.length > 0 ? (
        <>
          <ScrollableSnapList
            driverUpcomingRides
            dataset={upcomingList}
            getVariant={getVariant}
            onSelect={setSelectedIndex}
            sliderDirection={isMd ? "horizontal" : "vertical"}
            slidePerView={isLg ? 3 : isSm ? 2 : 3}
            swiperClassName={!isMd ? "h-full w-full" : ""}
            navigationArrows={isMd ? true : false}
            showPagination={isMd ? true : false}
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

      <span className="flex items-center w-fit gap-2 ml-4 cursor-pointer">
        Trajets archivés
      </span>
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
  );
};

export default DriverRidesList;
