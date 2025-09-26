import { Check, X } from "lucide-react";
import Button from "./Button";

type ConfirmModalProps = {
  message: string;
  toggleModal: () => void;
  onConfirm: () => void;
};
const ConfirmModal = ({ message, toggleModal, onConfirm }: ConfirmModalProps) => {
  return (
    <div>
      <div
        className="relative flex w-full max-w-md flex-col rounded-xl bg-gray-200 p-6 md:items-center md:justify-center"
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
          className="hover:!bg-primaryHover mb-4 self-end"
        />
        <h2 className="text-primary mb-4 text-xl font-bold">Confirmation</h2>

        <p className="whitespace-pre-line">{message}</p>
        <div className="my-6 flex items-center justify-end gap-4">
          <Button label="Annuler" type="button" icon={X} variant="refused" onClick={toggleModal} />
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
