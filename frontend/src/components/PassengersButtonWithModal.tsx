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
import { useState } from "react";

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

  const [info, setInfo] = useState(false);

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
            <>
              <span
                className="absolute rounded-full -right-[2px] -top-[2px] w-3 h-3 bg-refused animate-ping
             "
              ></span>
              <span
                className="absolute rounded-full -right-[2px] -top-[2px] w-3 h-3 bg-refused
             "
              ></span>
            </>
          )}
          <Button
            onMouseEnter={() => {
              if (waitingPassengers && waitingPassengers.length > 0) {
                setInfo(true);
              }
            }}
            onMouseLeave={() => {
              if (waitingPassengers && waitingPassengers.length > 0) {
                setInfo(false);
              }
            }}
            icon={Eye}
            type="button"
            onClick={toggleModal}
            label={isXl ? "Passagers" : ""}
            variant="secondary"
          />
          {info && waitingPassengers && waitingPassengers.length > 0 && (
            <div className="absolute bottom-full left-full bg-refused text-white overflow-hidden p-2 w-40 rounded-lg shadow-lg z-50">
              <p className="text-xs flex items-center justify-center gap-1">
                {waitingPassengers.length} passager
                {waitingPassengers.length > 1 ? "s" : ""} en attente
              </p>
            </div>
          )}
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
    </div>
  );
};

export default PassengersButtonWithModal;
