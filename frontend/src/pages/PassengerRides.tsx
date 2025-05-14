import SwitchTab, { Tab } from "../components/SwitchTabs";
import { useParams } from "react-router-dom";
import DriverRidesList from "../components/DriverRidesList";
import PassengerRidesList from "../components/PassengerRidesList";

const PassengerRides = () => {
  const { tab } = useParams();

  const dataset = [
    {
      id: "1",
      created_at: new Date("2023-09-30T08:00:00Z"),
      departure_city: "Paris",
      departure_at: new Date("2023-10-01T10:00:00Z"),
      arrival_city: "Lyon",
      arrival_at: new Date("2023-10-01T14:00:00Z"),
      departure_address: "123 Main St, Paris",
      arrival_address: "456 Central Ave, Lyon",
      max_passenger: 4,
      nb_passenger: 2,
      is_canceled: false,
      driver_id: { id: "driver1", name: "John Doe" },
    },
    {
      id: "2",
      created_at: new Date("2023-09-29T09:00:00Z"),
      departure_city: "Marseille",
      departure_at: new Date("2023-10-02T12:00:00Z"),
      arrival_city: "Nice",
      arrival_at: new Date("2023-10-02T15:00:00Z"),
      departure_address: "789 South St, Marseille",
      arrival_address: "321 North Ave, Nice",
      max_passenger: 3,
      nb_passenger: 1,
      is_canceled: true,
      driver_id: { id: "driver2", name: "Jane Smith" },
    },
    {
      id: "3",
      created_at: new Date("2023-09-28T07:00:00Z"),
      departure_city: "Lille",
      departure_at: new Date("2023-10-03T09:00:00Z"),
      arrival_city: "Strasbourg",
      arrival_at: new Date("2023-10-03T13:00:00Z"),
      departure_address: "456 East St, Lille",
      arrival_address: "654 West Ave, Strasbourg",
      max_passenger: 5,
      nb_passenger: 0,
      is_canceled: false,
      driver_id: { id: "driver3", name: "Alice Johnson" },
    },
    {
      id: "4",
      created_at: new Date("2025-09-28T07:00:00Z"),
      departure_city: "Lille",
      departure_at: new Date("2025-10-03T09:00:00Z"),
      arrival_city: "Strasbourg",
      arrival_at: new Date("2023-10-03T13:00:00Z"),
      departure_address: "456 East St, Lille",
      arrival_address: "654 West Ave, Strasbourg",
      max_passenger: 5,
      nb_passenger: 0,
      is_canceled: false,
      driver_id: { id: "driver3", name: "Alice Johnson" },
    },
    {
      id: "5",
      created_at: new Date("2025-09-28T07:00:00Z"),
      departure_city: "Lille",
      departure_at: new Date("2025-10-03T09:00:00Z"),
      arrival_city: "Strasbourg",
      arrival_at: new Date("2023-10-03T13:00:00Z"),
      departure_address: "456 East St, Lille",
      arrival_address: "654 West Ave, Strasbourg",
      max_passenger: 5,
      nb_passenger: 5,
      is_canceled: false,
      driver_id: { id: "driver3", name: "Alice Johnson" },
    },
    {
      id: "6",
      created_at: new Date("2025-09-28T07:00:00Z"),
      departure_city: "Lille",
      departure_at: new Date("2025-10-03T09:00:00Z"),
      arrival_city: "Strasbourg",
      arrival_at: new Date("2023-10-03T13:00:00Z"),
      departure_address: "456 East St, Lille",
      arrival_address: "654 West Ave, Strasbourg",
      max_passenger: 5,
      nb_passenger: 4,
      is_canceled: false,
      driver_id: { id: "6", name: "Alice Johnson" },
    },
  ];

  const tabs: Tab[] = [
    {
      label: "Conducteur",
      content: <DriverRidesList dataset={dataset} />,
      path: "/mes-trajets/driver",
    },
    {
      label: "Passager",
      content: <PassengerRidesList dataset={dataset} />,
      path: "/mes-trajets/passenger",
    },
  ];
  return (
    <div className=" flex flex-col fixed justify-center items-center h-full w-full sm:p-8">
      <SwitchTab tabs={tabs} tabParams={tab} />
    </div>
  );
};

export default PassengerRides;
