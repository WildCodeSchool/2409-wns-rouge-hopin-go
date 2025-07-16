import { useState } from "react";
import ScrollableSnapList from "./ScrollableSnapList";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryPassengerRides } from "../api/PassengerRides";
import {
  PassengerRidesQuery,
  PassengerRideStatus as GqlPassengerRideStatus,
} from "../gql/graphql";

type PassengerRide = PassengerRidesQuery["passengerRides"]["rides"][number];

const PassengerRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [upcomingOffset, setUpcomingOffset] = useState(0);
  const [upcomingList, setUpcomingList] = useState<PassengerRide[]>([]);
  const [archivedOffset, setArchivedOffset] = useState(0);
  const [archivedList, setArchivedList] = useState<PassengerRide[]>([]);
  const limit = 3;

  const { isSm, isMd, is2xl } = useBreakpoints();

  const getVariant = (dataset: PassengerRide): VariantType => {
    if (dataset.is_canceled) return "cancel";
    if (dataset.nb_passenger === dataset.max_passenger) return "full";
    if (dataset.passenger_status === GqlPassengerRideStatus.Waiting)
      return "pending";
    if (dataset.passenger_status === GqlPassengerRideStatus.Approved)
      return "validation";
    if (dataset.passenger_status === GqlPassengerRideStatus.Refused)
      return "refused";
    return "primary";
  };
  console.log("Upcoming List:", upcomingList);

  const { data: upcomingData } = useQuery(queryPassengerRides, {
    variables: { filter: "upcoming", limit, offset: upcomingOffset },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const newRides = data?.passengerRides?.rides ?? [];
      setUpcomingList((prev) => [...prev, ...newRides]);
    },
  });
  const totalUpcoming = upcomingData?.passengerRides?.totalCount ?? 0;

  const { data: archivedData } = useQuery(queryPassengerRides, {
    variables: { filter: "archived", limit, offset: archivedOffset },
    onCompleted: (data) => {
      const newRides = data?.passengerRides?.rides ?? [];
      setArchivedList((prev) => [...prev, ...newRides]);
    },
  });
  const totalArchived = archivedData?.passengerRides?.totalCount ?? 0;

  return (
    <div className="h-full w-full pt-4 pb-32 sm:pb-16 overflow-auto bg-gray-100">
      {/* Trajets à venir */}
      {upcomingList.length > 0 ? (
        <>
          <span className="flex items-center w-fit gap-2 ml-4 cursor-pointer">
            Trajets à venir
          </span>

          <ScrollableSnapList
            dataset={upcomingList}
            getVariant={getVariant}
            onSelect={setSelectedIndex}
            sliderDirection={isMd ? "horizontal" : "vertical"}
            slidePerView={is2xl ? 3 : isSm ? 2 : 3}
            swiperClassName={!isMd ? "h-full w-full" : ""}
            navigationArrows
            showPagination
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
          ) : upcomingList.length > limit ? (
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

      {/* Trajets archivés */}
      <span className="flex items-center w-fit gap-2 ml-4 cursor-pointer mt-6">
        Trajets archivés
      </span>
      {archivedList.length > 0 ? (
        <>
          <ScrollableSnapList
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

export default PassengerRidesList;
