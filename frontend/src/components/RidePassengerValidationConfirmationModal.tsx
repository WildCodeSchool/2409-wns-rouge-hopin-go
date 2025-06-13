import { Check, X } from "lucide-react";
import Button from "./Button";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { mutationValidatePassengerRide } from "../api/ValidatePassengerRide";
import { mutationRefusePassengerRide } from "../api/RefusePassengerRide";
import { toast } from "react-toastify";

type RidePassengerValidationConfirmationModalProps = {
  toggleModal: () => void;
  actionType?: "accept" | "refuse" | null;
};

const RidePassengerValidationConfirmationModal = ({
  toggleModal,
  actionType,
}: RidePassengerValidationConfirmationModalProps) => {
  const [selectedPassenger, setSelectedPassenger] = useState<{
    user_id: number;
    ride_id: number;
  } | null>(null);

  const [validatePassengerRide] = useMutation(mutationValidatePassengerRide);
  const [refusePassengerRide] = useMutation(mutationRefusePassengerRide);

  const handleConfirm = async () => {
    if (!selectedPassenger) return;

    try {
      if (actionType === "accept") {
        await validatePassengerRide({
          variables: {
            data: {
              user_id: selectedPassenger.user_id,
              ride_id: selectedPassenger.ride_id,
            },
          },
        });
      } else if (actionType === "refuse") {
        await refusePassengerRide({
          variables: {
            data: {
              user_id: selectedPassenger.user_id,
              ride_id: selectedPassenger.ride_id,
            },
          },
        });
      }
      setSelectedPassenger(null);
      // Optionally, you can refresh the list of passengers or rides here
      toggleModal();
      toast.success(
        `Passager ${actionType === "accept" ? "validé" : "refusé"} avec succès`
      );
    } catch (error) {
      console.error("Error validating/refusing passenger:", error);
    }
  };
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
          />
          <Button
            label="Confirmer"
            type="button"
            icon={Check}
            variant="validation"
            onClick={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default RidePassengerValidationConfirmationModal;
