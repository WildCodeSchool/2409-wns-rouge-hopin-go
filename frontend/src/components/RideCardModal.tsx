import { useQuery } from "@apollo/client";

import Button from "./Button";
import { X } from "lucide-react";
import { queryPassengersByRide } from "../api/PassengersByRide";
import CardTemplate from "./CardTemplate";
import { VariantType } from "../types/variantTypes";
import { Ride } from "../gql/graphql";

type RideCardModalProps = {
  rideId: string;
  toggleModal: () => void;
  variant: VariantType;
  data: Ride;
};

const RideCardModal = ({
  rideId,
  toggleModal,
  variant,
  data,
}: RideCardModalProps) => {
  // Query to fetch passengers by ride ID
  const { data: passengersData, loading } = useQuery(queryPassengersByRide, {
    variables: { ride_id: rideId },
  });

  if (loading) return <p>Chargement des passagers…</p>;
  const passengers = passengersData?.passengersByRide;

  const waitingPassengers = passengers?.filter(
    (passenger) => passenger.status === "waiting"
  );

  const acceptedPassengers = passengers?.filter(
    (passenger) => passenger.status === "validate"
  );

  return (
    <div>
      <div className="relative flex flex-col items-center justify-center h-full bg-purple-500 p-4">
        <Button
          icon={X}
          iconSize={26}
          type="button"
          variant="full"
          isBgTransparent
          onClick={toggleModal}
          className="hover:!bg-primaryHover self-end mb-4"
        />
        <CardTemplate variant={variant} data={data} />
        <div className="flex flex-col items-start">
          <div className="mb-5 mt-5">
            <h2 className="text-xl font-semi-bold text-white ">
              Passagers à valider :
            </h2>
            {waitingPassengers && waitingPassengers.length > 0 ? (
              waitingPassengers.map((passenger) => (
                <p key={passenger.user.id}>
                  {passenger.user.firstName} {passenger.user.lastName}
                </p>
              ))
            ) : (
              <p>
                Vous n'avez pas de passagers à valider sur ce trajet pour le
                moment.
              </p>
            )}
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-semi-bold text-white">
              Passagers acceptés :
            </h2>
            {acceptedPassengers && acceptedPassengers.length > 0 ? (
              acceptedPassengers.map((passenger) => (
                <p key={passenger.user.id}>
                  {passenger.user.firstName} {passenger.user.lastName}
                </p>
              ))
            ) : (
              <p>
                Vous n'avez pas acceptés de passager sur ce trajet pour le
                moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCardModal;
