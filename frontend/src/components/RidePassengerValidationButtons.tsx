import { useModal } from "../hooks/useModal";
import Button from "./Button";
import { Check, X } from "lucide-react";
import Modal from "./Modal";
import { useState } from "react";
import useRide from "../context/Rides/useRide";
import { useApolloClient, useMutation } from "@apollo/client";
import { PassengerRideStatus } from "../gql/graphql";
import { queryPassengersByRide } from "../api/PassengersByRide";
import { queryDriverRides } from "../api/DriverRides";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import { mutationDriverSetPassengerRideStatus } from "../api/UpdatePassengerRideStatus";

export type RidePassengerValidationButtonsProps = {
  passengerId: string;
};

const RidePassengerValidationButtons = ({
  passengerId,
}: RidePassengerValidationButtonsProps) => {
  const ride = useRide();
  const client = useApolloClient();
  const { isOpen, isVisible, openModal, closeModal, toggleModal } = useModal();
  const [actionType, setActionType] = useState<"accept" | "refuse" | null>(
    null
  );

  const [driverSetPassengerRideStatus] = useMutation(
    mutationDriverSetPassengerRideStatus
  );

  const modalId = `passenger-confirmation-${passengerId}`;

  const handleClick = (type: "accept" | "refuse") => {
    setActionType(type);
    openModal(modalId);
  };

  const handleConfirm = async () => {
    if (!ride.id || !passengerId) return;

    try {
      await driverSetPassengerRideStatus({
        variables: {
          data: {
            user_id: passengerId,
            ride_id: ride.id,
            status:
              actionType === "accept"
                ? PassengerRideStatus.Approved
                : PassengerRideStatus.Refused,
          },
        },
      });

      await client.refetchQueries({
        include: [queryDriverRides, queryPassengersByRide],
      });

      toggleModal(modalId);
      toast.success(
        `Passager ${actionType === "accept" ? "validé" : "refusé"} avec succès`
      );
    } catch (error) {
      console.error("Error validating/refusing passenger:", error);
    }
  };

  return (
    <>
      <div className="flex flex-row gap-4 items-center justify-end">
        <Button
          variant="validation"
          icon={Check}
          type="button"
          onClick={() => handleClick("accept")}
        />
        <Button
          variant="refused"
          icon={X}
          type="button"
          onClick={() => handleClick("refuse")}
        />
      </div>

      <Modal
        id={modalId}
        isOpen={isOpen(modalId)}
        isVisible={isVisible(modalId)}
        onClose={() => closeModal(modalId)}
      >
        <ConfirmModal
          message={`Etes-vous sûr de vouloir
          ${actionType === "accept" ? "valider" : "refuser"} ce passager ?`}
          toggleModal={() => toggleModal(modalId)}
          onConfirm={handleConfirm}
        />
      </Modal>
    </>
  );
};

export default RidePassengerValidationButtons;
