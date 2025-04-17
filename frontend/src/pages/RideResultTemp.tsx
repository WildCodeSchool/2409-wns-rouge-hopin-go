import { useQuery } from "@apollo/client";
import { querySearchRide } from "../api/SearchRide";
import { useSearchParams } from "react-router-dom";

const RideResultTemp = () => {
  const [searchParams] = useSearchParams();
  const departure_city = searchParams.get("departure_city")!;
  const arrival_city = searchParams.get("arrival_city")!;
  const departure_at = searchParams.get("departure_at")!;
  console.log("departure_city", departure_city);
  console.log("arrival_city", arrival_city);
  console.log("departure_at", departure_at);

  const { data } = useQuery(querySearchRide, {
    variables: {
      data: {
        departure_city,
        arrival_city,
        departure_at: new Date(departure_at + ":00"),
      },
    },
    skip: !departure_city || !arrival_city || !departure_at,
  });

  console.log("data", data);
  return <div></div>;
};

export default RideResultTemp;
