import { useApolloClient, useMutation } from "@apollo/client";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import { mutationCancelledRideByDriver } from "../api/CancelledRideByDriver";
import { Trash2 } from "lucide-react";
import useRide from "../context/Rides/useRide";
import Button from "./Button";
import ConfirmModal from "./ConfirmModal";
import { toast } from "react-toastify";
import { queryDriverRides } from "../api/DriverRides";

const CancelledRideByDriverButton = ({
  onCloseParentModal,
}: {
  onCloseParentModal: () => void;
}) => {
  const client = useApolloClient();
  const ride = useRide();
  const { isOpen, isVisible, toggleModal, closeModal } = useModal();
  const modalId = "modal-cancel-ride";
  const [cancelRide, { loading, error }] = useMutation(
    mutationCancelledRideByDriver,
    {
      onCompleted: async () => {
        await client.refetchQueries({
          include: [queryDriverRides],
        });
        closeModal(modalId);
        if (onCloseParentModal) {
          onCloseParentModal();
        }
        toast.success("Le trajet a été annulé avec succès");
      },
    }
  );

  const handleCancel = async () => {
    try {
      await cancelRide({
        variables: { cancelRideId: ride.id },
      });
    } catch (err) {
      console.error("Error cancelling ride:", err);
      toast.error("Erreur lors de l'annulation du trajet");
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
          type="button"
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
          message={
            "Etes-vous sûr de vouloir annuler ce trajet ?\nCette action est irréversible."
          }
          onConfirm={handleCancel}
          toggleModal={() => closeModal(modalId)}
        />
      </Modal>
    </>
  );
};

export default CancelledRideByDriverButton;
