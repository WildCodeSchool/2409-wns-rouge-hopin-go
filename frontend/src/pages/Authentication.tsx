import SwitchTab from "../components/SwitchTabs";
import Signin from "../components/Signin";
import Signup from "../components/Signup";

export type Tab = {
  label: string;
  content: JSX.Element;
};
const AuthenticationPage = () => {
  const tabs: Tab[] = [
    { label: "Inscription", content: <Signup /> },
    { label: "Connexion", content: <Signin /> },
  ];
  return <SwitchTab tabs={tabs} />;
};

export default AuthenticationPage;
