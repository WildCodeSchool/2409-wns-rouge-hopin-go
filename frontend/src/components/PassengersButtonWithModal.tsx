import Modal from "./Modal";
import { useModal } from "../hooks/useModal";
import RideCardModal from "./RideCardModal";
import Button from "./Button";
import { Eye } from "lucide-react";
import useWindowSize from "../utils/useWindowSize";
import { VariantType } from "../types/variantTypes";
import { SearchRidesQuery } from "../gql/graphql";
import { useQuery } from "@apollo/client";
import { queryPassengersByRide } from "../api/PassengersByRide";

type SearchRide = SearchRidesQuery["searchRide"][number];

type PassengersButtonWithModalProps = {
  rideId: string;
  variant: VariantType;
  data: SearchRide;
};

const PassengersButtonWithModal = ({
  rideId,
  variant,
  data,
}: PassengersButtonWithModalProps) => {
  const { isOpen, visible, toggleModal } = useModal();
  const { isXl } = useWindowSize();

  const { data: passengersData, loading } = useQuery(queryPassengersByRide, {
    variables: { ride_id: rideId },
  });

  if (loading) return <p>Chargement des passagers…</p>;

  const passengers = passengersData?.passengersByRide ?? [];

  const waitingPassengers = passengers?.filter(
    (passenger) => passenger.status === "waiting"
  );

  const acceptedPassengers = passengers?.filter(
    (passenger) => passenger.status === "validate"
  );
  return (
    <div>
      <div className="absolute right-[170px] flex gap-2 items-center z-10 p-2 text-sm lg:text-base text-textLight font-semibold">
        <div className="relative">
          {waitingPassengers && waitingPassengers?.length > 0 && (
            <span className="absolute rounded-full -right-[2px] -top-[2px] w-2 h-2 bg-refused animate-pulse "></span>
          )}
          <Button
            icon={Eye}
            type="button"
            onClick={toggleModal}
            label={isXl ? "Passagers" : ""}
            variant="secondary"
          />
        </div>
      </div>
      <Modal isOpen={isOpen} visible={visible} toggleModal={toggleModal}>
        {() => (
          <RideCardModal
            rideId={rideId}
            variant={variant}
            toggleModal={toggleModal}
            data={data}
            waitingPassengers={waitingPassengers}
            acceptedPassengers={acceptedPassengers}
          />
        )}
      </Modal>
    </div>
  );
};

export default PassengersButtonWithModal;
