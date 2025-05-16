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
    <div className=" flex flex-col justify-center items-center h-full sm:h-[calc(100dvh-180px)] sm:mt-10 sm:px-8 w-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 fixed">
      <SwitchTab
        classContainer="bg-secondary text-primary h-full overflow-scroll"
        tabs={tabs}
        tabParams={tab}
      />
    </div>
  );
};

export default MyRides;
