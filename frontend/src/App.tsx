import { Link, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../public/logo.png";

const App = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header>
          <Link to="/">
            <img
              src={Logo}
              alt="Logo"
              className="invisible sm:visible absolute top-0 left-0 w-16 h-16 m-2"
            />
          </Link>
          <NavBar />
        </header>
        <main className="h-screen flex justify-center items-center">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default App;
