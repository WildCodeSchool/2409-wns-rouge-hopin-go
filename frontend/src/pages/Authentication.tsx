import SwitchTab, { Tab } from "../components/SwitchTabs";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import { useParams } from "react-router-dom";

const AuthenticationPage = () => {
  const { tab } = useParams();

  const tabs: Tab[] = [
    { label: "Inscription", content: <Signup />, path: "/auth/inscription" },
    { label: "Connexion", content: <Signin />, path: "/auth/connexion" },
  ];
  return <SwitchTab tabs={tabs} tabParams={tab} />;
};

export default AuthenticationPage;
