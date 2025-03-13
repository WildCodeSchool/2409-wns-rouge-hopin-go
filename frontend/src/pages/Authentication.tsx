import SwitchTab from "../components/SwitchTabs";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import { useParams } from "react-router-dom";

export type Tab = {
  label: string;
  content: JSX.Element;
};
const AuthenticationPage = () => {
  const { tab } = useParams();

  const tabs: Tab[] = [
    { label: "Inscription", content: <Signup /> },
    { label: "Connexion", content: <Signin /> },
  ];
  return <SwitchTab tabs={tabs} tabParams={tab} />;
};

export default AuthenticationPage;
