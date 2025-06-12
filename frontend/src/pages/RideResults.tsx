import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import ScrollableSnapList from "../components/ScrollableSnapList";
import CardRideDetails from "../components/CardRideDetails";
import { VariantType } from "../types/variantTypes";
import { querySearchRide } from "../api/SearchRide";
import { SearchRidesQuery } from "../gql/graphql";
import Button from "../components/Button";
import { ArrowLeft } from "lucide-react";

type Ride = SearchRidesQuery["searchRide"][number];

const RideResults = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchParams] = useSearchParams();

  const departure_city = searchParams.get("departure_city")!;
  const departure_lng = parseFloat(searchParams.get("departure_lng")!);
  const departure_lat = parseFloat(searchParams.get("departure_lat")!);
  const arrival_city = searchParams.get("arrival_city")!;
  const arrival_lng = parseFloat(searchParams.get("arrival_lng")!);
  const arrival_lat = parseFloat(searchParams.get("arrival_lat")!);
  const departure_at = searchParams.get("departure_at")!;


  const {
    data: dataSearched,
    loading,
    error,
  } = useQuery(querySearchRide, {
    variables: {
      data: {
        departure_city,
        departure_lng,
        departure_lat,
        arrival_city,
        arrival_lng,
        arrival_lat,
        departure_at: new Date(departure_at + ":00:00:00Z"),
      },
    },
    fetchPolicy: "network-only",
    skip: !departure_city || !arrival_city || !departure_at,
  });
  if (error) {
    return (
      <div className="text-center w-full mt-10 text-red-500">
        Une erreur est survenue lors de la recherche des trajets. Veuillez
        réessayer.
      </div>
    );
  }

  const rides = dataSearched?.searchRide ?? [];

  const getVariant = (ride: Ride): VariantType => {
    if (ride.is_canceled) return "cancel";
    if (ride.passenger_status === "waiting") return "pending";
    if (ride.passenger_status === "approved") return "validation";
    if (ride.passenger_status === "refused") return "refused";
    const availableSeats = ride.max_passenger - (ride.nb_passenger ?? 0);
    if (availableSeats <= 0) return "full";

    const departureDate = new Date(ride.departure_at);
    const today = new Date();
    if (departureDate < today) return "validation";

    return "primary";
  };

  if (rides.length === 0 || !rides[selectedIndex]) {
    return (
      <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center mt-10 text-gray-600">
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
      <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center mt-10 text-gray-600">
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
          direction="vertical"
          scaleEffect
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
