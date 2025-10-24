import { Link, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../public/logo.svg";
import { useQuery } from "@apollo/client";
import { queryWhoAmI } from "./api/WhoAmI";
import { CheckCircle } from "lucide-react";
import Footer from "./components/Footer";

const App = () => {
  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;
  return (
    <>
      <div>
        <header className="z-50 md:flex md:fixed">
          <div className=" items-center gap-4  hidden md:flex">
            <Link to="/">
              <img src={Logo} alt="Logo" className="m-2 h-16 w-16" />
            </Link>
            {me && (
              <span
                className="bg-primary flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white"
                title="Vous êtes connecté(e)"
              >
                {me?.firstName}
                <CheckCircle className="text-validation" />
              </span>
            )}
          </div>
          <NavBar />
        </header>
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
