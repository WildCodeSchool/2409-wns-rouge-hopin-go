import SwitchTab, { Tab } from "../components/SwitchTabs";

import { useParams } from "react-router-dom";
import SearchRide from "../components/SearchRide";
import { useQuery } from "@apollo/client";
import { queryWhoAmI } from "../api/WhoAmI";
import CreateRide from "../components/CreateRide";
import InformationMessage from "../components/InformationMessage";
import { useRef } from "react";

const Home = () => {
  const { tab } = useParams();
  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;
  const proposeRef = useRef<HTMLButtonElement>(null);

  const tabs: Tab[] = [
    {
      label: "Rechercher",
      content: <SearchRide variant="searchFormRide" proposeRef={proposeRef} />,
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
      <div className="fixed left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center md:h-3/4 md:w-3/4">
        <SwitchTab
          classContainer="bg-primary px-4"
          tabs={tabs}
          tabParams={tab}
          proposeRef={proposeRef}
        />
      </div>
    </>
  );
};

export default Home;
