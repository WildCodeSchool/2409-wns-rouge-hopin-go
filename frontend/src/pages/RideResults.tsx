import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import ScrollableSnapList from "../components/ScrollableSnapList";
import CardRideDetails from "../components/CardRideDetails";
import { VariantType } from "../types/variantTypes";
import { querySearchRide } from "../api/SearchRide";
import { SearchRidesQuery } from "../gql/graphql";

type Ride = SearchRidesQuery["searchRide"][number];

const RideResults = () => {
  const detailsRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchParams] = useSearchParams();

  const departure_city = searchParams.get("departure_city")!;
  const arrival_city = searchParams.get("arrival_city")!;
  const departure_at = searchParams.get("departure_at")!;

  const { data: dataSearched, loading } = useQuery(querySearchRide, {
    variables: {
      data: {
        departure_city,
        arrival_city,
        departure_at: new Date(departure_at + ":00:00:00Z"),
      },
    },
    skip: !departure_city || !arrival_city || !departure_at,
  });

  const rides = dataSearched?.searchRide ?? [];

  const getVariant = (ride: Ride): VariantType => {
    if (ride.is_canceled) return "cancel";
    const availableSeats = ride.max_passenger - (ride.nb_passenger ?? 0);
    if (availableSeats <= 0) return "error";

    const departureDate = new Date(ride.departure_at);
    const today = new Date();
    if (departureDate < today) return "validation";

    return "primary";
  };

  if (loading || rides.length === 0 || !rides[selectedIndex]) {
    return (
      <div className="text-center w-full mt-10 text-gray-600">
        Chargement des trajets...
      </div>
    );
  }

  return (
    <div className="flex items-center h-screen justify-center max-w-7xl m-auto bg-gray-100">
      <div className="flex h-full w-full z-20 md:w-1/2 overflow-hidden">
        <ScrollableSnapList
          dataset={rides}
          getVariant={getVariant}
          onSelect={setSelectedIndex}
          alignRef={detailsRef}
        />
      </div>
      <div className="h-full flex md:w-1/2">
        <CardRideDetails
          variant={getVariant(rides[selectedIndex])}
          data={rides[selectedIndex]}
        />
      </div>
    </div>
  );
};

export default RideResults;
