import SwitchTab, { Tab } from "../components/SwitchTabs";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import { useParams } from "react-router-dom";

const AuthenticationPage = () => {
  const { tab } = useParams();

  const tabs: Tab[] = [
    { label: "Inscription", content: <Signup />, path: "/auth/signup" },
    { label: "Connexion", content: <Signin />, path: "/auth/signin" },
  ];
  return (
    <div className="fixed left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center md:h-fit md:w-1/2">
      <SwitchTab tabs={tabs} tabParams={tab} classContainer="bg-primary py-4" />
    </div>
  );
};

export default AuthenticationPage;
