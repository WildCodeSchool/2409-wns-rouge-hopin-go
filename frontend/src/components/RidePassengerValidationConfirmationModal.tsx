import { Check, X } from "lucide-react";
import Button from "./Button";

type RidePassengerValidationConfirmationModalProps = {
  toggleModal: () => void;
  actionType?: "accept" | "refuse" | null;
};

const RidePassengerValidationConfirmationModal = ({
  toggleModal,
  actionType,
}: RidePassengerValidationConfirmationModalProps) => {
  return (
    <div>
      <div
        className="relative flex flex-col md:items-center md:justify-center bg-gray-200 p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
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

        <p>
          Etes-vous sûr de vouloir{" "}
          {actionType === "accept" ? "valider" : "refuser"} ce passager ?
        </p>
        <div className="flex gap-4 items-center justify-end my-6">
          <Button
            label="Annuler"
            type="button"
            icon={X}
            variant="refused"
            onClick={toggleModal}
            // className=" border-white border-2"
          />
          <Button
            label="Confirmer"
            type="button"
            icon={Check}
            variant="validation"
            onClick={toggleModal}
            // className=" border-white border-2"
          />
        </div>
      </div>
    </div>
  );
};

export default RidePassengerValidationConfirmationModal;
