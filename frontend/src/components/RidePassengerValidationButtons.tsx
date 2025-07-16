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
            passengerId={passengerId}
          />
        )}
      </Modal>
    </>
  );
};

export default RidePassengerValidationButtons;
