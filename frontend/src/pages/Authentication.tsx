import SigninTest from "../components/SigninTest";
import SignupTest from "../components/SignupTest";

import SwitchTab from "../components/SwitchTabs";

export type Tab = {
  label: string;
  content: JSX.Element;
};
const AuthenticationPage = () => {
  const tabs: Tab[] = [
    { label: "Inscription", content: <SignupTest /> },
    { label: "Connexion", content: <SigninTest /> },
  ];
  return <SwitchTab tabs={tabs} />;
};

export default AuthenticationPage;
