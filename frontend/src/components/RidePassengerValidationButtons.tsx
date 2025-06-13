import { useModal } from "../hooks/useModal";
import Button from "./Button";
import { Check, X } from "lucide-react";
import Modal from "./Modal";
import RidePassengerValidationConfirmationModal from "./RidePassengerValidationConfirmationModal";
import { useState } from "react";

const RidePassengerValidationButtons = () => {
  const { isOpen, visible, toggleModal: toggleChildModal } = useModal();
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
            toggleChildModal();
          }}
        />
        <Button
          variant="refused"
          icon={X}
          type="button"
          onClick={() => {
            setActionType("refuse");
            toggleChildModal();
          }}
        />
      </div>

      <Modal isOpen={isOpen} visible={visible} toggleModal={toggleChildModal}>
        {() => (
          <RidePassengerValidationConfirmationModal
            toggleModal={toggleChildModal}
            actionType={actionType}
          />
        )}
      </Modal>
    </>
  );
};

export default RidePassengerValidationButtons;
