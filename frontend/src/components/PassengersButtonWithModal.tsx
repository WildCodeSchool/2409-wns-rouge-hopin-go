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
import { useLocation } from "react-router-dom";
import CardRideDetailsMobileModal from "./CardRideDetailsMobileModal";
import useRide from "../context/Rides/useRide";
import { isAfter, parseISO } from "date-fns";

type PassengersButtonWithModalProps = {
  variant: VariantType;
};

const PassengersButtonWithModal = ({
  variant,
}: PassengersButtonWithModalProps) => {
  const { isOpen, isVisible, openModal, closeModal } = useModal();
  const { isSm, isMd, isXl } = useWindowSize();

  const location = useLocation();
  const isMyRidesDriverPage = location.pathname.includes("my-rides/driver");
  const isMyRidesPassengerPage =
    location.pathname.includes("my-rides/passenger");
  const isRidesResultsPage = location.pathname.includes("ride-results");
  const ride = useRide();

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

  const openAppropriateModal = () => {
    if ((!isMd && isRidesResultsPage) || isMyRidesPassengerPage) {
      openModal("CardRideDetailsMobileModal");
    } else if (isMyRidesDriverPage) {
      openModal("RideCardModal");
    }
  };

  return (
    <div>
      <div className="absolute right-[65%] lg:right-[40%]    flex gap-2 items-center z-10 p-2 text-sm lg:text-base text-textLight font-semibold">
        <div className="relative">
          {isMyRidesDriverPage &&
            waitingPassengers &&
            waitingPassengers?.length > 0 &&
            isFuture && (
              <>
                <span className="absolute rounded-full -right-[2px] -top-[2px] w-3 h-3 bg-refused animate-ping"></span>
              </>
            )}
          {isMyRidesDriverPage && (
            <Button
              onMouseEnter={() => {
                setInfo(true);
              }}
              onMouseLeave={() => {
                setInfo(false);
              }}
              icon={Eye}
              type="button"
              onClick={openAppropriateModal}
              label={isXl ? "Passagers" : ""}
              variant="secondary"
            />
          )}
          {!isMd && isRidesResultsPage && (
            <Button
              onMouseEnter={() => {
                setInfo(true);
              }}
              onMouseLeave={() => {
                setInfo(false);
              }}
              icon={Eye}
              type="button"
              onClick={openAppropriateModal}
              label={isSm ? "Détails" : ""}
              variant="secondary"
            />
          )}
          {isMyRidesPassengerPage && (
            <Button
              onMouseEnter={() => {
                setInfo(true);
              }}
              onMouseLeave={() => {
                setInfo(false);
              }}
              icon={Eye}
              type="button"
              onClick={openAppropriateModal}
              label={isXl ? "Détails" : ""}
              variant="secondary"
            />
          )}
          {isMyRidesDriverPage &&
            info &&
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
          {isMyRidesDriverPage &&
            info &&
            waitingPassengers.length === 0 &&
            acceptedPassengers.length === 0 &&
            isFuture && (
              <div className="absolute bottom-full left-full bg-refused text-white overflow-hidden p-2 w-40 rounded-lg shadow-lg z-50">
                <p className="text-xs flex items-center justify-center gap-1">
                  Aucun passager en attente
                </p>
              </div>
            )}
          {isMyRidesPassengerPage &&
            info &&
            ride.available_seats === 0 &&
            acceptedPassengers.length > 0 &&
            isFuture && (
              <div className="absolute bottom-full left-full bg-refused text-white overflow-hidden p-2 w-40 rounded-lg shadow-lg z-50">
                <p className="text-xs flex items-center justify-center gap-1">
                  Trajet complet
                </p>
              </div>
            )}
        </div>
        <Modal
          id="RideCardModal"
          isOpen={isOpen("RideCardModal")}
          isVisible={isVisible("RideCardModal")}
          onClose={() => closeModal("RideCardModal")}
        >
          <RideCardModal
            variant={variant}
            toggleModal={() => closeModal("RideCardModal")}
            waitingPassengers={waitingPassengers}
            acceptedPassengers={acceptedPassengers}
          />
        </Modal>
        <Modal
          id="CardRideDetailsMobileModal"
          isOpen={isOpen("CardRideDetailsMobileModal")}
          isVisible={isVisible("CardRideDetailsMobileModal")}
          onClose={() => closeModal("CardRideDetailsMobileModal")}
        >
          <CardRideDetailsMobileModal
            variant={variant}
            toggleModal={() => closeModal("CardRideDetailsMobileModal")}
          />
        </Modal>
      </div>
    </div>
  );
};

export default PassengersButtonWithModal;
