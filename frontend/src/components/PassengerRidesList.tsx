import { useEffect, useState } from "react";
import ScrollableSnapList from "./ScrollableSnapList";
import { VariantType } from "../types/variantTypes";
import useBreakpoints from "../utils/useWindowSize";
import { useQuery } from "@apollo/client";
import { queryPassengerRides } from "../api/PassengerRides";
import { PassengerRidesQuery, PassengerRideStatus } from "../gql/graphql";
import Button from "./Button";

type PassengerRide = PassengerRidesQuery["passengerRides"]["rides"][number];

const PassengerRidesList = () => {
  const [, setSelectedIndex] = useState(0);
  const [upcomingOffset, setUpcomingOffset] = useState(0);
  const [upcomingList, setUpcomingList] = useState<PassengerRide[]>([]);
  const [archivedOffset, setArchivedOffset] = useState(0);
  const [archivedList, setArchivedList] = useState<PassengerRide[]>([]);
  const [comingListView, setComingListView] = useState<boolean>(true);
  const limit = 3;

  const { isSm, isMd, is2xl } = useBreakpoints();

  const getVariant = (dataset: PassengerRide): VariantType => {
    if (dataset.is_cancelled) return "cancel";
    if (dataset.nb_passenger === dataset.max_passenger) return "full";
    if (dataset.current_user_passenger_status === PassengerRideStatus.Waiting) return "pending";
    if (dataset.current_user_passenger_status === PassengerRideStatus.Approved) return "validation";
    if (dataset.current_user_passenger_status === PassengerRideStatus.Refused) return "refused";
    return "primary";
  };

  // --- Upcoming Rides ---
  const {
    data: upcomingData,
    refetch: refetchUpcoming,
    loading: loadingUpcoming,
  } = useQuery(queryPassengerRides, {
    variables: { filter: "upcoming", limit, offset: upcomingOffset },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!upcomingData?.passengerRides?.rides) return;
    const filtered =
      upcomingData.passengerRides.rides.filter(
        (ride) => ride.current_user_passenger_status !== PassengerRideStatus.CancelledByPassenger
      ) ?? [];
    setUpcomingList((prev) => (upcomingOffset === 0 ? filtered : [...prev, ...filtered]));
  }, [upcomingData, upcomingOffset]);

  const totalUpcoming = upcomingData?.passengerRides?.totalCount ?? 0;

  // --- Archived Rides ---
  const {
    data: archivedData,
    refetch: refetchArchived,
    loading: loadingArchived,
  } = useQuery(queryPassengerRides, {
    variables: { filter: "archived", limit, offset: archivedOffset },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!archivedData?.passengerRides?.rides) return;
    const filtered =
      archivedData.passengerRides.rides.filter(
        (r) => r.current_user_passenger_status !== PassengerRideStatus.CancelledByPassenger
      ) ?? [];
    setArchivedList((prev) => (archivedOffset === 0 ? filtered : [...prev, ...filtered]));
  }, [archivedData, archivedOffset]);

  const totalArchived = archivedData?.passengerRides?.totalCount ?? 0;
  const hasMoreUpcoming = totalUpcoming > upcomingList.length;
  const hasMoreArchived = totalArchived > archivedList.length;

  useEffect(() => {
    const handleRefetch = async () => {
      await Promise.all([refetchUpcoming(), refetchArchived()]);
    };

    handleRefetch();
  }, []);

  return (
    <div className="z-10 flex h-full w-full flex-col bg-gray-100 sm:pb-16">
      {/* --- Mobile: onglets comme la page conducteur --- */}
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

      {/* --- Mobile: liste "à venir" --- */}
      {!isMd && comingListView && (
        <div className="relative h-[calc(100dvh-58px)] w-full">
          {loadingUpcoming ? (
            <div className="mt-10 w-full text-center text-gray-500">Chargement...</div>
          ) : upcomingList.length > 0 ? (
            <>
              <ScrollableSnapList
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
              {hasMoreUpcoming ? (
                <Button
                  onClick={() => setUpcomingOffset((p) => p + limit)}
                  className="absolute bottom-16 left-1/2 z-50 -translate-x-1/2"
                  label={`Voir plus (${totalUpcoming - upcomingList.length} restants)`}
                />
              ) : upcomingList.length > limit ? (
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

      {/* --- Mobile: liste "archivés" --- */}
      {!isMd && !comingListView && (
        <div className="relative h-[calc(100dvh-58px)] w-full">
          {loadingArchived ? (
            <div className="mt-10 w-full text-center text-gray-500">Chargement...</div>
          ) : archivedList.length > 0 ? (
            <>
              <ScrollableSnapList
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
              {hasMoreArchived ? (
                <Button
                  onClick={() => setArchivedOffset((p) => p + limit)}
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

      {/* --- Desktop: deux sections empilées comme la page conducteur --- */}
      {isMd && (
        <>
          <div className="my-2 flex h-full flex-col gap-4 sm:gap-0">
            <span className="ml-4">Trajets à venir</span>
            {loadingUpcoming ? (
              <div className="mt-10 w-full text-center text-gray-500">Chargement...</div>
            ) : upcomingList.length > 0 ? (
              <>
                <ScrollableSnapList
                  dataset={upcomingList}
                  getVariant={getVariant}
                  onSelect={setSelectedIndex}
                  sliderDirection="horizontal"
                  slidePerView={is2xl ? 3 : isSm ? 2 : 3}
                  swiperClassName=""
                  navigationArrows
                  showPagination
                  spaceBetween={0}
                />
                {hasMoreUpcoming ? (
                  <div className="mr-4 mt-2 flex justify-end">
                    <button
                      onClick={() => setUpcomingOffset((p) => p + limit)}
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
              <div className="mt-10 w-full text-center">Aucun trajet à venir.</div>
            )}
          </div>

          <div className="my-20 flex h-full flex-col gap-4 sm:my-0 sm:gap-0">
            <span className="ml-4">Trajets archivés</span>
            {loadingArchived ? (
              <div className="mt-10 w-full text-center text-gray-500">Chargement...</div>
            ) : archivedList.length > 0 ? (
              <>
                <ScrollableSnapList
                  dataset={archivedList}
                  getVariant={getVariant}
                  onSelect={setSelectedIndex}
                  sliderDirection="horizontal"
                  slidePerView={is2xl ? 3 : isSm ? 2 : 3}
                  swiperClassName=""
                  navigationArrows
                  showPagination
                />
                {hasMoreArchived ? (
                  <div className="mr-4 mt-2 flex justify-end">
                    <button
                      onClick={() => setArchivedOffset((p) => p + limit)}
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

export default PassengerRidesList;
