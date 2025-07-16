import { Check, X } from "lucide-react";
import Button from "./Button";
import { useApolloClient, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { mutationUpdatePassengerRideStatus } from "../api/UpdatePassengerRideStatus";
import { PassengerRideStatus } from "../gql/graphql";
import { queryPassengersByRide } from "../api/PassengersByRide";
import { queryDriverRides } from "../api/DriverRides";
import useRide from "../context/Rides/useRide";

type RidePassengerValidationConfirmationModalProps = {
  toggleModal: () => void;
  actionType?: "accept" | "refuse" | null;
  // rideId: string;
  passengerId?: string;
};

const RidePassengerValidationConfirmationModal = ({
  toggleModal,
  actionType,
  // rideId,
  passengerId,
}: RidePassengerValidationConfirmationModalProps) => {
  const ride = useRide();
  console.log("Ride depuis context confirmation:", ride.id);
  const client = useApolloClient();
  const [updatePassengerRideStatus] = useMutation(
    mutationUpdatePassengerRideStatus
  );

  const handleConfirm = async () => {
    // if (!rideId || !passengerId) return;
    if (!ride.id || !passengerId) return;

    try {
      await updatePassengerRideStatus({
        variables: {
          data: {
            user_id: passengerId,
            // ride_id: rideId,
            ride_id: ride.id,
            status:
              actionType === "accept"
                ? PassengerRideStatus.Approved
                : PassengerRideStatus.Refused,
          },
        },
      });

      await client.refetchQueries({
        // include: ["SearchRides", "PassengersByRide"],
        include: [queryDriverRides, queryPassengersByRide],
      });

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
