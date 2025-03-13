import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { queryWhoAmI } from "../api/WhoAmI";
import { mutationSignout } from "../api/Signout";
import Button from "./Button";
import {
  CarFront,
  CirclePlus,
  CircleUserRound,
  MessageCircle,
  Search,
} from "lucide-react";
import { useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;

  // Utilisation de la mutation signout
  const [doSignout] = useMutation(mutationSignout, {
    refetchQueries: [queryWhoAmI],
  });

  const handleSignout = () => {
    doSignout();
    navigate("/authentication");
  };
  console.log("me => ", me);

  return (
    <>
      {/* Version Mobile */}

      {/* Toggle Menu */}
      <div
        className={`md:hidden fixed bottom-[62px] transition-transform duration-300 ease-in-out transform right-0 z-40 flex w-fit h-18 bg-primary p-2 rounded-tl-lg ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col items-start gap-2 p-4 w-full">
          <Link to="/authentication/inscription" className="w-full">
            <h2 className="border-gray-300 bg-gray-50 shadow-sm border text-sm font-semibold rounded-md  block w-full px-4 py-1.5 text-primary">
              Inscription
            </h2>
          </Link>
          <Link to="/authentication/connexion" className="w-full">
            <h2 className="border-gray-300 bg-gray-50 shadow-sm border text-sm font-semibold rounded-md  block w-full px-4 py-1.5 text-primary">
              Connexion
            </h2>
          </Link>
          {me ? (
            <div className="w-full">
              <h2
                className="border-gray-300 bg-gray-50 shadow-sm border text-sm font-semibold rounded-md  block w-full px-4 py-1.5 text-primary"
                onClick={handleSignout}
              >
                Déconnexion
              </h2>
            </div>
          ) : null}
        </div>
      </div>

      {/* Navbar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex w-full h-18
       bg-primary text-secondary "
      >
        <div className="flex items-center justify-around w-full">
          {/* si l'utilisateur n'est pas connecté il ne peut pas voir ses trajets
          et est redirigé vers la page d'accueil. Autre solution : afficher un
          message sur la page des trajets : Vous devez être connecté pour voir
          vos trajets = à voir ce qui est le plus pertinent, idem pour les
          autres onglets : messages, et proposer. */}
          {me ? (
            <Link to="/" className="">
              <Button
                label="Trajets"
                icon={CarFront}
                iconSize={18}
                isFlexCol
                className="!p-2 text-sm font-semibold"
              />
            </Link>
          ) : null}
          {me ? (
            <Link to="/" className="">
              <Button
                label="Messages"
                icon={MessageCircle}
                iconSize={18}
                isFlexCol
                className="!p-2 text-sm font-semibold"
              />
            </Link>
          ) : null}
          <Link to="/" className="">
            <Button
              label="Rechercher"
              icon={Search}
              iconSize={18}
              isFlexCol
              className="!p-2 text-sm font-semibold"
            />
          </Link>
          {me ? (
            <Link to="/" className="">
              <Button
                label="Proposer"
                icon={CirclePlus}
                iconSize={18}
                isFlexCol
                className="!p-2 text-sm font-semibold"
              />
            </Link>
          ) : null}
          <div>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              label="Profil"
              icon={CircleUserRound}
              iconSize={18}
              isFlexCol
              className="!p-2 text-sm font-semibold"
            />
          </div>
        </div>
      </nav>
      {/* Version Desktop */}
      {/* <nav
        className="flex w-fit
       justify-between items-center p-4 gap-4 bg-primary text-secondary "
      >
        <h1>
          <Link to="/" className="">
            <span className="">Trajets</span>
          </Link>
        </h1>
        <Button
          variant="pending"
          icon={Search}
          iconSize={18}
          label="Recherche"
        />

        <Button variant="error" icon={Search} />

        <Button variant="validation" label="Valider" />
        <form className="">
          <input className="" type="search" />
          <button className="">
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-50 -50 530 550"
              transform="scale(-1, 1)"
              fill="currentColor"
              xmlSpace="preserve"
              className="styled__BaseIcon-sc-1jsm4qr-0 llmHhT"
            >
              <path d="m464.524 412.846-97.929-97.925c23.6-34.068 35.406-72.047 35.406-113.917 0-27.218-5.284-53.249-15.852-78.087-10.561-24.842-24.838-46.254-42.825-64.241-17.987-17.987-39.396-32.264-64.233-42.826C254.246 5.285 228.217.003 200.999.003c-27.216 0-53.247 5.282-78.085 15.847C98.072 26.412 76.66 40.689 58.673 58.676c-17.989 17.987-32.264 39.403-42.827 64.241C5.282 147.758 0 173.786 0 201.004c0 27.216 5.282 53.238 15.846 78.083 10.562 24.838 24.838 46.247 42.827 64.234 17.987 17.993 39.403 32.264 64.241 42.832 24.841 10.563 50.869 15.844 78.085 15.844 41.879 0 79.852-11.807 113.922-35.405l97.929 97.641c6.852 7.231 15.406 10.849 25.693 10.849 9.897 0 18.467-3.617 25.694-10.849 7.23-7.23 10.848-15.796 10.848-25.693.003-10.082-3.518-18.651-10.561-25.694zM291.363 291.358c-25.029 25.033-55.148 37.549-90.364 37.549-35.21 0-65.329-12.519-90.36-37.549-25.031-25.029-37.546-55.144-37.546-90.36 0-35.21 12.518-65.334 37.546-90.36 25.026-25.032 55.15-37.546 90.36-37.546 35.212 0 65.331 12.519 90.364 37.546 25.033 25.026 37.548 55.15 37.548 90.36 0 35.216-12.519 65.331-37.548 90.36z"></path>
            </svg>
          </button>
        </form>
        {me?.role === "admin" && (
          <>
            <Link to="/Admin" className="">
              Admin
            </Link>
            <Link to="/ads/new" className="">
              <span className="">Publier</span>
              <span className="">Publier une annonce</span>
            </Link>
            <button type="button" className="" onClick={handleSignout}>
              Déconnexion
            </button>
          </>
        )}
        {me?.role === "user" ? (
          <>
            <Link to="/ads/new" className="">
              <span className="">Publier</span>
              <span className="">Publier une annonce</span>
            </Link>
            <button type="button" className="" onClick={handleSignout}>
              Déconnexion
            </button>
          </>
        ) : me === null ? (
          <>
            <Link to="/signin" className="">
              Connexion
            </Link>
            <Link to="/signup" className="">
              Inscription
            </Link>
          </>
        ) : null}
      </nav>
      <nav className="">navigation</nav> */}
    </>
  );
};

export default NavBar;
