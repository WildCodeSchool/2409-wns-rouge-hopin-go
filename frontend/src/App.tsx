import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <ToastContainer
        toastClassName="toast-custom"
        bodyClassName="toast-body"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <header className="header">
        <NavBar />
      </header>
      <main className=" mt-32">
        <Outlet />
      </main>
    </>
  );
};

export default App;
