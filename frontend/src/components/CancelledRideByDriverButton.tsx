import { useMutation } from "@apollo/client";
import { mutationCancelledRideByDriver } from "../api/CancelledRideByDriver";
import { Trash2 } from "lucide-react";
import useRide from "../context/Rides/useRide";
import Button from "./Button";

const CancelledRideByDriverButton = () => {
  const ride = useRide();
  const [cancelRide, { loading, error }] = useMutation(
    mutationCancelledRideByDriver
  );

  const handleCancel = async () => {
    try {
      await cancelRide({
        variables: { cancelRideId: ride.id },
      });
    } catch (err) {
      console.error("Error cancelling ride:", err);
    }
  };

  if (loading) return <span>Annulation en cours...</span>;
  if (error) return <span>Erreur lors de l'annulation</span>;

  return (
    <>
      <Button
        onClick={handleCancel}
        variant="refused"
        type="submit"
        className="danger text-white px-4 py-2 rounded"
        label="Annuler le trajet ?"
        icon={Trash2}
        iconSize={20}
      />
    </>
  );
};

export default CancelledRideByDriverButton;
