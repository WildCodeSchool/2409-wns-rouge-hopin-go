import { Link, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../public/logo.png";
import { useQuery } from "@apollo/client";
import { queryWhoAmI } from "./api/WhoAmI";

const App = () => {
  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header>
          <div className="flex flex-row">
            <Link to="/">
              <img
                src={Logo}
                alt="Logo"
                className="invisible sm:visible absolute top-0 left-0 w-16 h-16 m-2"
              />
            </Link>
            {me?.email}
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
