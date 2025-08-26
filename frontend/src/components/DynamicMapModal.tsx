import { X } from "lucide-react";
import Button from "./Button";
import Map from "./Map";
import { formatTravelDuration } from "../utils/formatTravelDuration";

interface DynamicMapModalProps {
  toggleModal: () => void;
  dataId: string | number;
  departureCity: string;
  departureLongitude: number;
  departureLatitude: number;
  arrivalCity: string;
  arrivalLongitude: number;
  arrivalLatitude: number;
  setTravelDuration: (duration: string) => void;
  setTravelDistance: (distance: string) => void;
}

const DynamicMapModal = ({
  toggleModal,
  dataId,
  departureCity,
  departureLongitude,
  departureLatitude,
  arrivalCity,
  arrivalLongitude,
  arrivalLatitude,
  setTravelDuration,
  setTravelDistance,
}: DynamicMapModalProps) => {
  return (
    <div
      id="DynamicMapModal"
      className="relative z-0 flex flex-col  p-4 h-screen w-screen md:max-w-2xl md:h-fit md:rounded-2xl bg-gray-200"
    >
      <header className="w-full flex justify-end">
        <Button
          icon={X}
          iconColor="text-primary"
          hoverIconColor="!text-white"
          iconSize={26}
          type="button"
          variant="full"
          isBgTransparent
          onClick={toggleModal}
          className="group hover:!bg-primaryHover self-end"
        />
      </header>
      <main className="relative flex flex-col gap-4 justify-between">
        <Map
          mapId={`dynamic-map-${dataId}`}
          departureLatitude={departureLatitude}
          departureLongitude={departureLongitude}
          departureCity={departureCity}
          arrivalLatitude={arrivalLatitude}
          arrivalLongitude={arrivalLongitude}
          arrivalCity={arrivalCity}
          onRouteData={({ distanceKm, durationMin }) => {
            setTravelDuration(`${formatTravelDuration(durationMin)}`);
            setTravelDistance(`${distanceKm.toFixed(1)} km`);
          }}
        />
      </main>
    </div>
  );
};

export default DynamicMapModal;
