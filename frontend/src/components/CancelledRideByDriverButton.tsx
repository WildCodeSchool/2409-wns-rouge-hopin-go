import { useMutation } from "@apollo/client";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import { mutationCancelledRideByDriver } from "../api/CancelledRideByDriver";
import { Trash2 } from "lucide-react";
import useRide from "../context/Rides/useRide";
import Button from "./Button";
import ConfirmModal from "./ConfirmModal";
import { toast } from "react-toastify";

const CancelledRideByDriverButton = () => {
  const ride = useRide();
  const { isOpen, isVisible, toggleModal, closeModal } = useModal();
  const [cancelRide, { loading, error }] = useMutation(
    mutationCancelledRideByDriver
  );
  const modalId = "modal-cancel-ride";

  const handleCancel = async () => {
    try {
      await cancelRide({
        variables: { cancelRideId: ride.id },
      });
      toggleModal("RideCardModal");
      toast.success("Le trajet a été annulé avec succès");
    } catch (err) {
      console.error("Error cancelling ride:", err);
    }
  };

  if (loading) return <span>Annulation en cours...</span>;
  if (error) return <span>Erreur lors de l'annulation</span>;

  return (
    <>
      <div className="text-end">
        <Button
          onClick={() => toggleModal(modalId)}
          variant="refused"
          type="submit"
          className="danger text-white px-4 py-2 rounded"
          label="Annuler le trajet ?"
          icon={Trash2}
          iconSize={20}
        />
      </div>
      <Modal
        id={modalId}
        isOpen={isOpen(modalId)}
        isVisible={isVisible(modalId)}
        onClose={() => closeModal(modalId)}
      >
        <ConfirmModal
          message={`Etes-vous sûr de vouloir annuler ce trajet ?`}
          onConfirm={handleCancel}
          toggleModal={() => closeModal(modalId)}
        />
      </Modal>
    </>
  );
};

export default CancelledRideByDriverButton;
