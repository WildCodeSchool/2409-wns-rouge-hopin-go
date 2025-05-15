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
    <div className=" flex flex-col justify-center items-center w-full h-full md:w-1/2 md:h-fit top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  fixed">
      <SwitchTab tabs={tabs} tabParams={tab} classContainer="bg-primary py-4" />
    </div>
  );
};

export default AuthenticationPage;
