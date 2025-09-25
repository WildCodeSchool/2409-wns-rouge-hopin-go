import Button from "./Button";
import { X } from "lucide-react";
import CardTemplate from "./CardTemplate";
import { VariantType } from "../types/variantTypes";
import { PassengersByRideQuery } from "../gql/graphql";
import RidePassengerValidationButtons from "./RidePassengerValidationButtons";
import { isAfter, parseISO } from "date-fns";
import useRide from "../context/Rides/useRide";
import CancelledRideByDriverButton from "./CancelledRideByDriverButton";

type RideCardModalProps = {
  toggleModal: () => void;
  onClose: () => void;
  variant: VariantType;
  waitingPassengers?: PassengersByRideQuery["passengersByRide"];
  acceptedPassengers?: PassengersByRideQuery["passengersByRide"];
};

const RideCardModal = ({
  toggleModal,
  onClose,
  variant,
  waitingPassengers,
  acceptedPassengers,
}: RideCardModalProps) => {
  const ride = useRide();
  const departureDate = parseISO(ride.departure_at);
  const now = new Date();
  const isFuture = isAfter(departureDate, now);
  return (
    <div className="relative flex flex-col items-center justify-center md:rounded-2xl bg-gray-200 p-4 w-screen h-screen md:w-[750px] md:h-auto">
      <Button
        icon={X}
        iconColor="!text-black"
        hoverIconColor="!text-white"
        iconSize={26}
        type="button"
        variant="full"
        isBgTransparent
        onClick={toggleModal}
        className="group hover:!bg-primaryHover self-end mb-4"
      />
      <CardTemplate variant={variant} isModal={true} />
      <div className="flex flex-col items-start justify-start w-full">
        {ride.is_cancelled && (
          <h2 className="text-xl m-auto font-bold text-primary">
            Trajet annulé
          </h2>
        )}
        {isFuture && ride.available_seats > 0 && !ride.is_cancelled && (
          <div className="mb-5 mt-5 w-full">
            <h2 className="text-xl font-bold text-primary">
              Passagers à valider :
            </h2>
            {waitingPassengers && waitingPassengers.length > 0 ? (
              waitingPassengers.map((passenger) => (
                <div
                  className="flex items-center justify-between space-y-4"
                  key={passenger.user.id}
                >
                  <p key={passenger.user.id}>
                    {passenger.user.firstName} {passenger.user.lastName}
                  </p>
                  <div className="flex items-center">
                    <RidePassengerValidationButtons
                      passengerId={passenger.user.id}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>
                Vous n&apos;avez pas de passagers à valider sur ce trajet pour
                le moment.
              </p>
            )}
          </div>
        )}
        {ride.is_cancelled === false && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-primary">
              {isFuture ? "Passagers acceptés :" : "Passagers :"}
            </h2>
            {acceptedPassengers && acceptedPassengers.length > 0 ? (
              acceptedPassengers.map((passenger) => (
                <p key={passenger.user.id}>
                  {passenger.user.firstName} {passenger.user.lastName}
                </p>
              ))
            ) : (
              <>
                <p>
                  {isFuture
                    ? "Vous n'avez pas acceptés de passager sur ce trajet pour le moment."
                    : "Ce trajet n'a pas de passagers."}
                </p>
              </>
            )}
          </div>
        )}
        {isFuture && ride.is_cancelled === false && (
          <div className="flex justify-end w-full">
            <CancelledRideByDriverButton onCloseParentModal={onClose} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RideCardModal;
