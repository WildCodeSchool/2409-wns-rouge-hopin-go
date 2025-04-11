import { useEffect, useRef, useState } from "react";
import CardRideDetails from "../components/CardRideDetails";
import { VariantType } from "../types/variantTypes";
import ScrollableSnapList from "../components/ScrollableSnapList";
import { CardData } from "../components/CardTemplate";
import { formatDate, formatTime } from "../utils/formatDate";

type FakeRide = {
  departure_city: string;
  arrival_city: string;
  departure_address: string;
  arrival_address: string;
  departure_at: Date;
  arrival_at: Date;
  max_passenger: number;
  nb_passenger: number;
  driver_id: { name: string };
  is_canceled?: boolean;
};

const generateFakeRides = (): FakeRide[] => {
  const cities = [
    "Chambéry",
    "Annecy",
    "Albertville",
    "Grenoble",
    "Lyon",
    "Aix-les-Bains",
    "Moûtiers",
    "Bourg-Saint-Maurice",
    "La Ravoire",
    "Saint-Jean-de-Maurienne",
  ];

  const names = [
    "Élodie",
    "Julien",
    "Manon",
    "Thibault",
    "Camille",
    "Lucas",
    "Mireille",
    "François-Xavier",
    "Océane",
    "Alexandre",
  ];

  const rides: FakeRide[] = [];

  for (let i = 0; i < 10; i++) {
    const departureCity = cities[Math.floor(Math.random() * cities.length)];
    let arrivalCity = departureCity;
    while (arrivalCity === departureCity) {
      arrivalCity = cities[Math.floor(Math.random() * cities.length)];
    }

    const now = new Date();
    const departureDate = new Date(
      now.getTime() + Math.random() * 10 * 86400000
    ); // +0 à 10 jours
    const durationMin = 60 + Math.floor(Math.random() * 60); // entre 1h et 2h
    const arrivalDate = new Date(departureDate.getTime() + durationMin * 60000);

    const maxPassenger = 1 + Math.floor(Math.random() * 4);
    const nbPassenger = Math.floor(Math.random() * (maxPassenger + 1));
    const driverName = names[Math.floor(Math.random() * names.length)];

    rides.push({
      departure_city: departureCity,
      arrival_city: arrivalCity,
      departure_address: `Rue de la Gare, ${departureCity}`,
      arrival_address: `Place du Centre, ${arrivalCity}`,
      departure_at: departureDate,
      arrival_at: arrivalDate,
      max_passenger: maxPassenger,
      nb_passenger: nbPassenger,
      driver_id: { name: driverName },
      is_canceled: Math.random() < 0.1, // 10% des trajets annulés
    });
  }

  return rides;
};

const RideResults = () => {
  const detailsRef = useRef<HTMLDivElement>(null);
  const [rides, setRides] = useState<CardData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fakeRides = generateFakeRides();

    const dataset: CardData[] = fakeRides.map((ride) => {
      const dateStr = formatDate(ride.departure_at);

      const departureTime = formatTime(ride.departure_at);
      const arrivalTime = formatTime(ride.arrival_at);

      const durationMin = Math.floor(
        (ride.arrival_at.getTime() - ride.departure_at.getTime()) / 60000
      );
      const travelDuration =
        durationMin >= 60
          ? `${Math.floor(durationMin / 60)}h${durationMin % 60 || ""}`
          : `${durationMin}min`;

      return {
        departureTime,
        arrivalTime,
        departureCity: ride.departure_city,
        arrivalCity: ride.arrival_city,
        travelDuration,
        driverName: ride.driver_id.name,
        price: 10 + Math.random() * 15, // prix aléatoire
        date: dateStr,
        availableSeats: ride.max_passenger - ride.nb_passenger,
        is_canceled: ride.is_canceled,
      };
    });

    setRides(dataset);
    setSelectedIndex(0);
  }, []);

  const getVariant = (
    data: CardData & { is_canceled?: boolean }
  ): VariantType => {
    const today = new Date();

    // 🔴 1. Si le trajet est annulé
    if (data.is_canceled) return "cancel";

    // 🔴 2. Si complet
    if (data.availableSeats === 0) return "error";

    // 🟠 3. Si le trajet est dans le passé
    const [jour, moisNom, annee] = data.date.split(" ");
    const moisMap: Record<string, number> = {
      janvier: 0,
      février: 1,
      mars: 2,
      avril: 3,
      mai: 4,
      juin: 5,
      juillet: 6,
      août: 7,
      septembre: 8,
      octobre: 9,
      novembre: 10,
      décembre: 11,
    };
    const parsedDate = new Date(+annee, moisMap[moisNom.toLowerCase()], +jour);

    if (parsedDate < today) return "validation";

    // ✅ Sinon : trajet à venir avec places dispo
    return "primary";
  };

  if (rides.length === 0 || !rides[selectedIndex]) {
    return (
      <div className="text-center w-full mt-10 text-gray-600">
        Chargement des trajets...
      </div>
    );
  }

  return (
    <div className="flex items-center  h-screen justify-center max-w-7xl m-auto bg-gray-100">
      <div className="flex-1 h-full w-full z-20  md:w-1/2 overflow-hidden">
        <ScrollableSnapList
          dataset={rides}
          getVariant={getVariant}
          onSelect={setSelectedIndex}
          alignRef={detailsRef}
        />
      </div>

      <div className="h-full flex md:w-1/2">
        <CardRideDetails
          variant={getVariant(rides[selectedIndex])}
          data={rides[selectedIndex]}
        />
      </div>
    </div>
  );
};

export default RideResults;
