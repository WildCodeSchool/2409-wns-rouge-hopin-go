import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import ScrollableSnapList from "../components/ScrollableSnapList";
import CardRideDetails from "../components/CardRideDetails";
import { VariantType } from "../types/variantTypes";
import { querySearchRide } from "../api/SearchRide";
import { PassengerRideStatus, SearchRidesQuery } from "../gql/graphql";
import Button from "../components/Button";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import useBreakpoints from "../utils/useWindowSize";

type SearchRide = SearchRidesQuery["searchRide"][number];

const RideResults = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchParams] = useSearchParams();

  const { isMd } = useBreakpoints();

  const departure_city = searchParams.get("departure_city")!;
  const departure_lng = parseFloat(searchParams.get("departure_lng")!);
  const departure_lat = parseFloat(searchParams.get("departure_lat")!);
  const departure_radius = parseInt(searchParams.get("departure_radius")!);
  const arrival_city = searchParams.get("arrival_city")!;
  const arrival_lng = parseFloat(searchParams.get("arrival_lng")!);
  const arrival_lat = parseFloat(searchParams.get("arrival_lat")!);
  const arrival_radius = parseInt(searchParams.get("arrival_radius")!);
  const departure_at = searchParams.get("departure_at")!;

  // ---- Pagination --------------------------------------------------------------
  const LIMIT = 4;
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  // ----End Pagination --------------------------------------------------------------

  const {
    data: dataSearched,
    loading,
    error,
    fetchMore,
  } = useQuery(querySearchRide, {
    variables: {
      data: {
        departure_city,
        departure_lng,
        departure_lat,
        departure_radius,
        arrival_city,
        arrival_lng,
        arrival_lat,
        arrival_radius,
        departure_at: new Date(departure_at + ":00:00:00Z"),
        limit: LIMIT,
        offset: 0,
      },
    },
    fetchPolicy: "network-only",
    skip: !departure_city || !arrival_city || !departure_at,
    onCompleted: (d) => {
      const firstPage = d?.searchRide?.length ?? 0;
      setHasMore(firstPage === LIMIT);
    },
  });
  if (error) {
    return (
      <div className="mt-10 w-full text-center text-red-500">
        Une erreur est survenue lors de la recherche des trajets. Veuillez réessayer.
      </div>
    );
  }

  const rides = dataSearched?.searchRide ?? [];

  const getVariant = (ride: SearchRide): VariantType => {
    if (ride.is_cancelled) return "cancel";
    if (ride.current_user_passenger_status === PassengerRideStatus.Waiting) return "pending";
    if (ride.current_user_passenger_status === PassengerRideStatus.Approved) return "validation";
    if (ride.current_user_passenger_status === PassengerRideStatus.Refused) return "refused";
    const availableSeats = ride.max_passenger - (ride.nb_passenger ?? 0);
    if (availableSeats <= 0) return "full";

    const departureDate = new Date(ride.departure_at);
    const today = new Date();
    if (departureDate < today) return "validation";

    return "primary";
  };

  // ---- Pagination --------------------------------------------------------------
  const loadMore = async () => {
    if (loadingMore) return; // anti double-clic
    setLoadingMore(true);
    try {
      const nextOffset = offset + LIMIT;
      await fetchMore({
        variables: {
          data: {
            departure_city,
            departure_lng,
            departure_lat,
            departure_radius,
            arrival_city,
            arrival_lng,
            arrival_lat,
            arrival_radius,
            departure_at: new Date(departure_at), // unifie avec le premier call
            limit: LIMIT,
            offset: nextOffset,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          const next = fetchMoreResult?.searchRide ?? [];
          setHasMore(next.length === LIMIT);
          return { searchRide: [...(prev?.searchRide ?? []), ...next] };
        },
      });
      setOffset(nextOffset);
    } finally {
      setLoadingMore(false);
    }
  };
  // ----End Pagination --------------------------------------------------------------

  if (rides.length === 0 || !rides[selectedIndex]) {
    return (
      <div className="fixed left-1/2 top-1/2 mt-10 -translate-x-1/2 -translate-y-1/2 text-center text-gray-600">
        Aucun trajet trouvé.
        <Button
          icon={ArrowLeft}
          isLink
          label="Retour à la recherche"
          isHoverBgColor
          variant="primary"
          className="mt-4"
          to="/research"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed left-1/2 top-1/2 mt-10 -translate-x-1/2 -translate-y-1/2 text-center text-gray-600">
        Chargement des trajets...
      </div>
    );
  }

  return (
    <div className="relative flex items-center h-screen justify-center max-w-7xl m-auto bg-gray-100">
      <div className="relative flex h-full w-full z-20 md:w-1/2 overflow-visible">
        {hasMore && (
          <div className="absolute z-30 bottom-20 left-1/2 -translate-x-1/2">
            <Button
              disabled={!hasMore || loadingMore}
              icon={loadingMore ? LoaderCircle : undefined}
              iconRotateAnimation={loadingMore}
              label={loadingMore ? "Chargement..." : "Charger plus"}
              onClick={loadMore}
              variant="secondary"
              className="shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        )}
        <ScrollableSnapList
          dataset={rides}
          getVariant={getVariant}
          onSelect={setSelectedIndex}
          sliderDirection="vertical"
          scaleEffect
          centerSlides={isMd ? true : false}
          swiperClassName="h-full w-full"
          spaceBetween={isMd ? 50 : 0}
          slidePerView={3}
        />
        <div className="pointer-events-none absolute top-1/2 right-0 hidden xl:flex w-full z-0 -translate-y-1/2 justify-center translate-x-[4.3px] bg-gray-100 ">
          <svg
            id="overlay"
            className="scale-y-[1.01]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 648.14 389.63"
          >
            <path
              style={{
                fill: "#f3f4f6",
                stroke: "#8e387c",
                strokeWidth:4,
              }}
              className="overlay"
              d="M645.72,389.63c0-20.75-13.43-37.57-30-37.57H28c-14.36,0-26-14.58-26-32.56V70.26c0-17.98,11.64-32.56,26-32.56h588.14c16.6,0,30.05-16.89,30-37.69"
            />
          </svg>
        </div>
      </div>
      <div className="flex h-full md:w-1/2 z-0">
        <CardRideDetails variant={getVariant(rides[selectedIndex])} data={rides[selectedIndex]} />
      </div>
    </div>
  );
};

export default RideResults;
