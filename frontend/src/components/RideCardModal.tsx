import { useQuery } from "@apollo/client";

import Button from "./Button";
import { X } from "lucide-react";
import { queryPassengersByRide } from "../api/PassengersByRide";

type RideCardModalProps = {
  rideId: string;
  toggleModal: () => void;
};

const RideCardModal = ({ rideId, toggleModal }: RideCardModalProps) => {
  const { data, loading, error } = useQuery(queryPassengersByRide, {
    variables: { ride_id: rideId },
  });

  console.log("data", data);

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
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">
            Bienvenue sur notre plateforme de covoiturage !
          </h1>
          <p className="text-lg">
            Connectez-vous pour profiter de toutes nos fonctionnalités.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RideCardModal;
