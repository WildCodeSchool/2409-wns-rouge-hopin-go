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
      <div className="flex flex-col min-h-screen">
        <header>
          <NavBar />
        </header>
<<<<<<< HEAD
        <main>
=======
        <main className="md:pt-[58px] pb-[18px] md:pb-0 flex-grow flex items-center justify-center md:h-[calc(100vh_-_58px)] mb-4">
>>>>>>> dev
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default App;
