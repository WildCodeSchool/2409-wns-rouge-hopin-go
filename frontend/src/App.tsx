import { Link, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../public/logo.png";
import { useQuery } from "@apollo/client";
import { queryWhoAmI } from "./api/WhoAmI";
import { CheckCircle } from "lucide-react";

const App = () => {
  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="z-50 invisible md:visible">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img src={Logo} alt="Logo" className="w-16 h-16 m-2" />
            </Link>
            {me && (
              <span
                className="flex items-center gap-2 text-sm  py-2 px-4 rounded-full text-white bg-primary"
                title="Vous êtes connecté"
              >
                {me?.email}
                <CheckCircle className="text-validation" />
              </span>
            )}
          </div>
          <NavBar />
        </header>
        <main className="h-screen">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default App;
