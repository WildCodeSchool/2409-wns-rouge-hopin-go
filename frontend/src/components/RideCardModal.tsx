import Button from "./Button";
import { X } from "lucide-react";
import CardTemplate from "./CardTemplate";
import { VariantType } from "../types/variantTypes";
import { PassengersByRideQuery, SearchRidesQuery } from "../gql/graphql";

type SearchRide = SearchRidesQuery["searchRide"][number];

type RideCardModalProps = {
  rideId: string;
  toggleModal: () => void;
  variant: VariantType;
  data: SearchRide;
  waitingPassengers?: PassengersByRideQuery["passengersByRide"];
  acceptedPassengers?: PassengersByRideQuery["passengersByRide"];
};

const RideCardModal = ({
  toggleModal,
  variant,
  data,
  waitingPassengers,
  acceptedPassengers,
}: RideCardModalProps) => {
  console.log("waiting passengers:", waitingPassengers);
  console.log("accepted passengers:", acceptedPassengers);
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
