import { useApolloClient, useMutation } from "@apollo/client";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import { Trash2 } from "lucide-react";
import useRide from "../context/Rides/useRide";
import Button from "./Button";
import ConfirmModal from "./ConfirmModal";
import { toast } from "react-toastify";
import { mutationPassengerWithdrawFromRide } from "../api/PassengerWithdrawFromRide";
import { queryPassengerRides } from "../api/PassengerRides";

const WithdrawPassengerButton = ({
  onCloseParentModal,
}: {
  onCloseParentModal: () => void;
}) => {
  const client = useApolloClient();
  const ride = useRide();
  const { isOpen, isVisible, toggleModal, closeModal } = useModal();
  const modalId = "modal-withdraw-passenger-ride";

   const [passengerWithdrawFromRide, { loading, error }] = useMutation(
    mutationPassengerWithdrawFromRide,
    {
      onCompleted: async () => {
        closeModal(modalId);
        onCloseParentModal?.();

        await client.refetchQueries({
          include: [queryPassengerRides],
        });

        toast.success("Le trajet a été annulé avec succès");
      },
      onError: () => {
        toast.error("Erreur lors de l'annulation du trajet");
      },
    }
  );

  const handleCancel = async () => {
    await passengerWithdrawFromRide({
      variables: { id: ride.id },
    });
  };

  if (error) return <span>Erreur lors de l&apos;annulation</span>;

  return (
    <>
      <div className="text-end">
        <Button
          onClick={() => toggleModal(modalId)}
          disabled={loading}
          variant="refused"
          type="button"
          className="danger rounded px-4 py-2 text-white"
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

export default WithdrawPassengerButton;
