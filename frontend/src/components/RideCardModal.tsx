import { useQuery } from "@apollo/client";
import { useModal } from "../hooks/useModal";

const RideCardModal = ({ ride_id }) => {
  const { data, loading, error } = useQuery(queryPassengerRide, {
    variables: { data: { ride_id } },
  });

  return (
    <div>
      <h1>Passagers à valider</h1>
      <img src={maleUser} alt="profile" width={80} />
    </div>
  );
};

export default RideCardModal;
