import SwitchTab, { Tab } from "../components/SwitchTabs";

import { useParams } from "react-router-dom";
import SearchRide from "../components/SearchRide";
import { useQuery } from "@apollo/client";
import { queryWhoAmI } from "../api/WhoAmI";
import CreateRide from "../components/CreateRide";
import InformationMessage from "../components/InformationMessage";

const Home = () => {
  const { tab } = useParams();
  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;

  const tabs: Tab[] = [
    { label: "Rechercher", content: <SearchRide />, path: "/rechercher" },
    ...(me
      ? [{ label: "Proposer", content: <CreateRide />, path: "/proposer" }]
      : [
          {
            label: "Proposer",
            content: <InformationMessage />,
            path: "/proposer",
          },
        ]),
  ];
  return (
    <>
      <div className=" flex flex-col fixed justify-center items-center h-full w-full sm:py-24 sm:px-24 lg:px-60">
        <SwitchTab classContainer="bg-primary" tabs={tabs} tabParams={tab} />
      </div>
    </>
  );
};

export default Home;
