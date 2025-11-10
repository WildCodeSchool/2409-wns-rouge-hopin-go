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
import CardRideDetailsPassengerModal from "./CardRideDetailsPassengerModal";
import useRide from "../context/Rides/useRide";
import { isAfter, parseISO } from "date-fns";

type PassengersButtonWithModalProps = {
  variant: VariantType;
  isModal?: boolean;
};

const PassengersButtonWithModal = ({
  variant,
  isModal = false,
}: PassengersButtonWithModalProps) => {
  const { isOpen, isVisible, openModal, closeModal } = useModal();
  const { isSm, isMd, isXl } = useWindowSize();

  const location = useLocation();
  const isMyRidesDriverPage = location.pathname.includes("my-rides/driver");
  const isMyRidesPassengerPage = location.pathname.includes("my-rides/passenger");
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

  const rideCancelled = ride.is_cancelled;

  const openAppropriateModal = () => {
    if ((!isMd && isRidesResultsPage) || isMyRidesPassengerPage) {
      openModal("CardRideDetailsPassengerModal");
    } else if (isMyRidesDriverPage) {
      openModal("RideCardModal");
    }
  };

  if (isModal) return null;
  return (
    <div>
      <div className="text-textLight absolute right-[55%] z-10 flex items-center gap-2 p-2 text-sm font-semibold md:right-[40%] lg:right-[38%] lg:text-base">
        <div className="relative">
          {isMyRidesDriverPage &&
            waitingPassengers &&
            waitingPassengers?.length > 0 &&
            isFuture &&
            !rideCancelled && (
              <>
                <span className="bg-refused absolute -right-[2px] -top-[2px] h-3 w-3 animate-ping rounded-full"></span>
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
              label={isXl ? "Détails" : ""}
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
              className="!mr-5 sm:!mr-10"
            />
          )}
          {isMyRidesDriverPage &&
            info &&
            waitingPassengers &&
            waitingPassengers.length > 0 &&
            isFuture &&
            !rideCancelled && (
              <div className="bg-refused absolute bottom-full left-full z-50 w-40 overflow-hidden rounded-lg p-2 text-white shadow-lg">
                <p className="flex items-center justify-center gap-1 text-xs">
                  {waitingPassengers.length} passager
                  {waitingPassengers.length > 1 ? "s" : ""} en attente
                </p>
              </div>
            )}
          {isMyRidesDriverPage &&
            info &&
            waitingPassengers.length === 0 &&
            acceptedPassengers.length === 0 &&
            isFuture &&
            !rideCancelled && (
              <div className="bg-refused absolute bottom-full left-full z-50 w-40 overflow-hidden rounded-lg p-2 text-white shadow-lg">
                <p className="flex items-center justify-center gap-1 text-xs">
                  Aucun passager en attente
                </p>
              </div>
            )}
          {isMyRidesPassengerPage &&
            info &&
            ride.available_seats === 0 &&
            acceptedPassengers.length > 0 &&
            isFuture &&
            !rideCancelled && (
              <div className="bg-refused absolute bottom-full left-full z-50 w-40 overflow-hidden rounded-lg p-2 text-white shadow-lg">
                <p className="flex items-center justify-center gap-1 text-xs">Trajet complet</p>
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
            onClose={() => closeModal("RideCardModal")}
            waitingPassengers={waitingPassengers}
            acceptedPassengers={acceptedPassengers}
          />
        </Modal>
        <Modal
          id="CardRideDetailsPassengerModal"
          isOpen={isOpen("CardRideDetailsPassengerModal")}
          isVisible={isVisible("CardRideDetailsPassengerModal")}
          onClose={() => closeModal("CardRideDetailsPassengerModal")}
        >
          <CardRideDetailsPassengerModal
            variant={variant}
            toggleModal={() => closeModal("CardRideDetailsPassengerModal")}
          />
        </Modal>
      </div>
    </div>
  );
};

export default PassengersButtonWithModal;
