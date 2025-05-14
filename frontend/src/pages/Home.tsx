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
    {
      label: "Rechercher",
      content: <SearchRide variant="searchFormRide" />,
      path: "/research",
    },
    ...(me
      ? [{ label: "Proposer", content: <CreateRide />, path: "/propose" }]
      : [
          {
            label: "Proposer",
            content: <InformationMessage />,
            path: "/propose",
          },
        ]),
  ];
  return (
    <>
      <div className=" flex flex-col justify-center items-center w-full h-full md:w-3/4 md:h-3/4  fixed">
        <SwitchTab
          classContainer="bg-primary px-4"
          tabs={tabs}
          tabParams={tab}
        />
      </div>
    </>
  );
};

export default Home;
