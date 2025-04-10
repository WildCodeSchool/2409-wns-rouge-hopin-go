import SwitchTab, { Tab } from "../components/SwitchTabs";

import { useParams } from "react-router-dom";
import SearchRide from "../components/SearchRide";
import Signin from "../components/Signin";
import { useQuery } from "@apollo/client";
import { queryWhoAmI } from "../api/WhoAmI";

const Home = () => {
  const { tab } = useParams();
  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;

  const tabs: Tab[] = [
    { label: "Rechercher", content: <SearchRide />, path: "/rechercher" },
    ...(me
      ? [{ label: "Proposer", content: <Signin />, path: "/proposer" }]
      : []),
  ];
  return (
    <div className="flex-grow flex items-center justify-center h-full mx-6 max-w-1xl md:max-w-4xl overflow-hidden z-50">
      <div className="flex-1">
        <SwitchTab tabs={tabs} tabParams={tab} />
      </div>
    </div>
  );
};

export default Home;
