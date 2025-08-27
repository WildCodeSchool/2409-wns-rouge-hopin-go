import { Check, X } from "lucide-react";
import Button from "./Button";

type ConfirmModalProps = {
  message: string;
  toggleModal: () => void;
  onConfirm: () => void;
};
const ConfirmModal = ({
  message,
  toggleModal,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div>
      <div
        className="relative flex flex-col md:items-center md:justify-center bg-gray-200 p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()} // Prevent closing modal on button click
      >
        <Button
          icon={X}
          iconColor="!text-black"
          iconSize={26}
          type="button"
          variant="full"
          isBgTransparent
          onClick={toggleModal}
          className="hover:!bg-primaryHover self-end mb-4"
        />
        <h2 className="text-xl font-bold text-primary mb-4">Confirmation</h2>

        <p className="whitespace-pre-line">{message}</p>
        <div className="flex gap-4 items-center justify-end my-6">
          <Button
            label="Annuler"
            type="button"
            icon={X}
            variant="refused"
            onClick={toggleModal}
          />
          <Button
            label="Confirmer"
            type="button"
            icon={Check}
            variant="validation"
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
