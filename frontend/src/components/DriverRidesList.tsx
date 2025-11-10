import { useEffect, useState } from "react";
import ScrollableSnapList from "./ScrollableSnapList";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryDriverRides } from "../api/DriverRides";
import { DriverRidesQuery } from "../gql/graphql";
import Button from "./Button";

type DriverRide = DriverRidesQuery["driverRides"]["rides"][number];
const DriverRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [upcomingOffset, setUpcomingOffset] = useState(0);
  const [upcomingList, setUpcomingList] = useState<DriverRide[]>([]);
  const [archivedOffset, setArchivedOffset] = useState(0);
  const [archivedList, setArchivedList] = useState<DriverRide[]>([]);
  const [comingListView, setComingListView] = useState<boolean>(true);
  const limit = 3;

  const { isSm, isMd, is2xl } = useBreakpoints();

  const getVariant = (dataset: DriverRide): VariantType => {
    if (dataset.is_cancelled) return "cancel";
    if (dataset.departure_at && new Date(dataset.departure_at) <= new Date()) return "secondary";
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
    <div className="z-10 flex h-full w-full flex-col bg-gray-100 sm:pb-16">
      {!isMd && (
        <div className="flex w-full justify-center">
          <button
            onClick={() => setComingListView(true)}
            className={`w-full px-4 py-2 font-medium ${
              comingListView ? "bg-primary text-white" : "text-primary bg-white"
            }`}
          >
            Trajets à venir
          </button>
          <button
            onClick={() => setComingListView(false)}
            className={`w-full px-4 py-2 font-medium ${
              !comingListView ? "bg-primary text-white" : "text-primary bg-white"
            }`}
          >
            Trajets archivés
          </button>
        </div>
      )}
      {!isMd && comingListView && (
        <div className="h-[calc(100dvh-58px)] w-full">
          {upcomingList.length > 0 ? (
            <>
              <ScrollableSnapList
                driverUpcomingRides
                dataset={upcomingList}
                getVariant={getVariant}
                onSelect={setSelectedIndex}
                sliderDirection="vertical"
                slidePerView={2}
                swiperClassName="!pb-40"
                navigationArrows={false}
                showPagination={false}
                spaceBetween={10}
              />
              {totalUpcoming > upcomingList.length ? (
                <Button
                  onClick={() => setUpcomingOffset((prev) => prev + limit)}
                  className="absolute bottom-16 left-1/2 z-50 -translate-x-1/2"
                  label={`Voir plus (${totalUpcoming - upcomingList.length} restants)`}
                />
              ) : upcomingList.length > 3 ? (
                <Button
                  onClick={() => {
                    setUpcomingList([]);
                    setUpcomingOffset(0);
                  }}
                  className="absolute bottom-16 left-1/2 z-50 -translate-x-1/2"
                  label={`Voir moins (${upcomingList.length} affichés)`}
                />
              ) : null}
            </>
          ) : (
            <div className="mt-10 w-full text-center">Aucun trajet à venir.</div>
          )}
        </div>
      )}
      {!isMd && !comingListView && (
        <div className="h-[calc(100dvh-58px)] w-full">
          {archivedList.length > 0 ? (
            <>
              <ScrollableSnapList
                driverUpcomingRides
                dataset={archivedList}
                getVariant={getVariant}
                onSelect={setSelectedIndex}
                sliderDirection="vertical"
                slidePerView={2}
                swiperClassName="!pb-40"
                navigationArrows={false}
                showPagination={false}
                spaceBetween={10}
              />
              {totalArchived > archivedList.length ? (
                <Button
                  onClick={() => setArchivedOffset((prev) => prev + limit)}
                  className="absolute bottom-16 left-1/2 z-50 -translate-x-1/2"
                  label={`Voir plus (${totalArchived - archivedList.length} restants)`}
                />
              ) : archivedList.length > limit ? (
                <Button
                  onClick={() => {
                    setArchivedList([]);
                    setArchivedOffset(0);
                  }}
                  className="absolute bottom-16 left-1/2 z-50 -translate-x-1/2"
                  label={`Voir moins (${archivedList.length} affichés)`}
                />
              ) : null}
            </>
          ) : (
            <div className="mt-10 w-full text-center">Aucun trajet archivé.</div>
          )}
        </div>
      )}
      {isMd && (
        <>
          <div className="my-2 flex h-full flex-col gap-4 sm:gap-0">
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
              <div className="mt-10 w-full text-center">Aucun trajet à venir.</div>
            )}
          </div>
          <div className="my-20 flex h-full flex-col gap-4 sm:my-0 sm:gap-0">
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
              <div className="mt-10 w-full text-center">Aucun trajet archivé.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DriverRidesList;
