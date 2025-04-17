import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header>
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
