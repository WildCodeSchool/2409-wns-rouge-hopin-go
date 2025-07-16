import { useModal } from "../hooks/useModal";
import Button from "./Button";
import { Check, X } from "lucide-react";
import Modal from "./Modal";
import RidePassengerValidationConfirmationModal from "./RidePassengerValidationConfirmationModal";
import { useState } from "react";
import useRide from "../context/Rides/useRide";

export type RidePassengerValidationButtonsProps = {
  // rideId: string;
  passengerId: string;
};

const RidePassengerValidationButtons = ({
  // rideId,
  passengerId,
}: RidePassengerValidationButtonsProps) => {
  const ride = useRide();
  console.log("Ride depuis context:", ride.id);
  const confirm = useModal();
  const [actionType, setActionType] = useState<"accept" | "refuse" | null>(
    null
  );
  return (
    <>
      <div className="flex flex-row gap-4 items-center justify-end">
        <Button
          variant="validation"
          icon={Check}
          type="button"
          onClick={() => {
            setActionType("accept");
            // toggleChildModal();
            confirm.openModal();
          }}
        />
        <Button
          variant="refused"
          icon={X}
          type="button"
          onClick={() => {
            setActionType("refuse");
            confirm.openModal();
          }}
        />
      </div>

      <Modal
        isOpen={confirm.isOpen}
        visible={confirm.visible}
        toggleModal={confirm.closeModal}
      >
        {() => (
          <RidePassengerValidationConfirmationModal
            toggleModal={confirm.closeModal}
            actionType={actionType}
            // rideId={rideId}
            // rideId={ride.id}
            passengerId={passengerId}
          />
        )}
      </Modal>
    </>
  );
};

export default RidePassengerValidationButtons;
