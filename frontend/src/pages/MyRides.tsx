import SwitchTab, { Tab } from "../components/SwitchTabs";
import { useParams } from "react-router-dom";
import DriverRidesList from "../components/DriverRidesList";
import PassengerRidesList from "../components/PassengerRidesList";

const MyRides = () => {
  const { tab } = useParams();

  const tabs: Tab[] = [
    {
      label: "Conducteur",
      content: <DriverRidesList />,
      path: "/my-rides/driver",
    },
    {
      label: "Passager",
      content: <PassengerRidesList />,
      path: "/my-rides/passenger",
    },
  ];
  return (
    <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center md:fixed md:left-1/2 md:top-1/2 md:mt-10 md:h-[calc(100dvh-180px)] md:-translate-x-1/2 md:-translate-y-1/2 md:px-8">
      <SwitchTab classContainer="bg-secondary text-primary" tabs={tabs} tabParams={tab} />
    </div>
  );
};

export default MyRides;
