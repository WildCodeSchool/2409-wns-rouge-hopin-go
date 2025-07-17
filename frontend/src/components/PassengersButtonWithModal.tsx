import Modal from "./Modal";
import { useModal } from "../hooks/useModal";
import RideCardModal from "./RideCardModal";
import Button from "./Button";
import { Eye } from "lucide-react";
import useWindowSize from "../utils/useWindowSize";
import { VariantType } from "../types/variantTypes";
import { PassengerRideStatus } from "../gql/graphql";
import { useQuery } from "@apollo/client";
import { queryPassengersByRide } from "../api/PassengersByRide";
import { useState } from "react";
import useRide from "../context/Rides/useRide";
import { isAfter, parseISO } from "date-fns";

type PassengersButtonWithModalProps = {
  variant: VariantType;
};

const PassengersButtonWithModal = ({
  variant,
}: PassengersButtonWithModalProps) => {
  const ride = useRide();
  const { isOpen, visible, toggleModal: toggleParentModal } = useModal();
  const { isXl } = useWindowSize();
  console.log("Ride at:", ride.departure_at);

  const departureDate = parseISO(ride.departure_at);
  const now = new Date();
  const isFuture = isAfter(departureDate, now);

  const [info, setInfo] = useState(false);

  const { data: passengersData, loading } = useQuery(queryPassengersByRide, {
    variables: { ride_id: ride.id },
    skip: !ride.id,
  });

  if (loading) return <p>Chargement des passagers…</p>;

  const passengers = passengersData?.passengersByRide ?? [];

  const waitingPassengers = passengers?.filter(
    (passenger) => passenger.status === PassengerRideStatus.Waiting
  );

  const acceptedPassengers = passengers?.filter(
    (passenger) => passenger.status === PassengerRideStatus.Approved
  );

  return (
    <div>
      <div className="absolute right-[170px] flex gap-2 items-center z-10 p-2 text-sm lg:text-base text-textLight font-semibold">
        <div className="relative">
          {waitingPassengers && waitingPassengers?.length > 0 && isFuture && (
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
              setInfo(true);
            }}
            onMouseLeave={() => {
              setInfo(false);
            }}
            icon={Eye}
            type="button"
            onClick={toggleParentModal}
            label={isXl ? "Passagers" : ""}
            variant="secondary"
          />
          {info &&
            waitingPassengers &&
            waitingPassengers.length > 0 &&
            isFuture && (
              <div className="absolute bottom-full left-full bg-refused text-white overflow-hidden p-2 w-40 rounded-lg shadow-lg z-50">
                <p className="text-xs flex items-center justify-center gap-1">
                  {waitingPassengers.length} passager
                  {waitingPassengers.length > 1 ? "s" : ""} en attente
                </p>
              </div>
            )}
          {info && waitingPassengers.length === 0 && isFuture && (
            <div className="absolute bottom-full left-full bg-refused text-white overflow-hidden p-2 w-40 rounded-lg shadow-lg z-50">
              <p className="text-xs flex items-center justify-center gap-1">
                Aucun passager en attente
              </p>
            </div>
          )}
        </div>
        <Modal
          isOpen={isOpen}
          visible={visible}
          toggleModal={toggleParentModal}
        >
          {() => (
            <RideCardModal
              variant={variant}
              toggleModal={toggleParentModal}
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
