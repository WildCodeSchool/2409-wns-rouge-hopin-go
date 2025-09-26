import { X } from "lucide-react";
import Button from "./Button";
import MapInteractive from "./MapInteractive";

interface DynamicMapModalProps {
  toggleModal: () => void;
  dataId: string | number;
  departureCity: string;
  departureLongitude: number;
  departureLatitude: number;
  arrivalCity: string;
  arrivalLongitude: number;
  arrivalLatitude: number;
  routePolyline5: string | null | undefined;
  distanceKm: number | null | undefined;
  durationMin: number | null | undefined;
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
  routePolyline5,
  distanceKm,
  durationMin,
}: DynamicMapModalProps) => {
  return (
    <div
      id="DynamicMapModal"
      className="relative z-0 flex h-[calc(100vh-8rem)] w-screen flex-col bg-gray-200 p-4 md:max-w-4xl md:rounded-2xl"
    >
      <header className="flex w-full justify-end">
        <Button
          icon={X}
          iconColor="text-primary"
          hoverIconColor="!text-white"
          iconSize={26}
          type="button"
          variant="full"
          isBgTransparent
          onClick={toggleModal}
          className="hover:!bg-primaryHover group self-end"
        />
      </header>
      <main className="relative flex h-full w-full flex-col justify-between gap-4">
        <MapInteractive
          mapId={`dynamic-map-${dataId}`}
          departureLatitude={departureLatitude}
          departureLongitude={departureLongitude}
          departureCity={departureCity}
          arrivalLatitude={arrivalLatitude}
          arrivalLongitude={arrivalLongitude}
          arrivalCity={arrivalCity}
          routePolyline5={routePolyline5 ?? undefined} // ✅ évite Directions
          distanceKm={distanceKm ?? undefined} // ✅ meta backend
          durationMin={durationMin ?? undefined}
        />
      </main>
    </div>
  );
};

export default DynamicMapModal;
