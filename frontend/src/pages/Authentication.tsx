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
  return (
    <div className="flex-grow flex items-center justify-center h-full m-auto max-w-sm sm:max-w-lg lg:max-w-4xl overflow-hidden z-50">
      <div className="flex-1">
        <SwitchTab tabs={tabs} tabParams={tab} />
      </div>
    </div>
  );
};

export default AuthenticationPage;
