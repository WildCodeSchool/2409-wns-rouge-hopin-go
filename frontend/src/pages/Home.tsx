import { Tab } from "./Authentication";
import SwitchTabs from "../components/SwitchTabs";
import SearchRide from "../components/SearchRide";
import CreateRide from "../components/CreateRide";


const Home = () => {

  const tabs: Tab[] = [
    { label: "Rechercher", content: <SearchRide /> },
    { label: "Proposer", content: <CreateRide /> },
  ];
  return <SwitchTabs tabs={tabs} />;
};


export default Home;
