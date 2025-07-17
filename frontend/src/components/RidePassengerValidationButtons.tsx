import { useModal } from "../hooks/useModal";
import Button from "./Button";
import { Check, X } from "lucide-react";
import Modal from "./Modal";
import RidePassengerValidationConfirmationModal from "./RidePassengerValidationConfirmationModal";
import { useState } from "react";

export type RidePassengerValidationButtonsProps = {
  passengerId: string;
};

const RidePassengerValidationButtons = ({
  passengerId,
}: RidePassengerValidationButtonsProps) => {
  const { isOpen, isVisible, openModal, closeModal } = useModal();
  const [actionType, setActionType] = useState<"accept" | "refuse" | null>(
    null
  );

  const modalId = `passenger-confirmation-${passengerId}`;

  const handleClick = (type: "accept" | "refuse") => {
    setActionType(type);
    openModal(modalId);
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
        <RidePassengerValidationConfirmationModal
          toggleModal={() => closeModal(modalId)}
          actionType={actionType}
          passengerId={passengerId}
        />
      </Modal>
    </>
  );
};

export default RidePassengerValidationButtons;
