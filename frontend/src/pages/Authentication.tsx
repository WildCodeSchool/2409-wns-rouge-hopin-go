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
    <div className=" flex flex-col justify-center items-center w-full h-full md:w-1/2 md:h-fit  fixed">
      <SwitchTab tabs={tabs} tabParams={tab} classContainer="bg-primary py-4" />
    </div>
  );
};

export default AuthenticationPage;
