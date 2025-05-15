import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { queryWhoAmI } from "../api/WhoAmI";
import { mutationSignout } from "../api/Signout";
import maleUser from "../assets/male-user.png";
import Button from "./Button";
import {
  CarFront,
  CirclePlus,
  CircleUserRound,
  MessageCircle,
  Search,
} from "lucide-react";
import { useRef, useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";

const NavBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(toggleMenuRef, () => setIsOpen(false), isOpen);

  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;

  // Utilisation de la mutation signout
  const [doSignout] = useMutation(mutationSignout, {
    refetchQueries: [queryWhoAmI],
  });

  const handleSignout = () => {
    doSignout();
    navigate("/");
  };

  return (
    <>
      {/* Version Mobile */}

      <div ref={toggleMenuRef}>
        {/* Toggle Menu */}
        <div
          className={`flex md:hidden fixed bottom-[58px] md:bottom-0 transition-transform duration-300 ease-in-out transform right-0 z-40 w-fit h-18 bg-primary p-2 rounded-tl-lg ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div
            className={`flex flex-col items-start gap-4 p-4 w-full transition-opacity duration-300 ease-in-out ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {!me ? (
              <>
                <Button
                  isLink
                  to="/auth/signup"
                  label="Inscription"
                  className="font-semibold"
                  variant="secondary"
                />
                <Button
                  isLink
                  to="/auth/signin"
                  label="Connexion"
                  className="font-semibold"
                  variant="secondary"
                />
              </>
            ) : null}
            {me ? (
              <>
                <Button
                  label="Déconnexion"
                  className="font-semibold"
                  variant="secondary"
                  onClick={handleSignout}
                />
              </>
            ) : null}
          </div>
        </div>

        {/* Navbar */}
        <nav
          className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 w-full h-18
      bg-primary text-secondary "
        >
          <div className="flex items-center justify-around w-full p-2">
            {me ? (
              <Button isLink to="/" icon={CarFront} iconSize={26} isFlexCol />
            ) : null}

            {me ? (
              <Button
                isLink
                to="/"
                icon={MessageCircle}
                iconSize={26}
                isFlexCol
              />
            ) : null}

            <Button
              isLink
              to="/ride-results"
              icon={Search}
              iconSize={26}
              isFlexCol
            />

            {me ? (
              <Button isLink to="/" icon={CirclePlus} iconSize={26} isFlexCol />
            ) : null}

            <Button
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              icon={CircleUserRound}
              iconSize={26}
              isFlexCol
            />
          </div>
        </nav>

        {/* Version Desktop */}

        {/* Navbar */}
        <nav className="hidden md:flex justify-end fixed -right-4 -top-6 overflow-hidden z-50">
          <div className=" flex justify-between gap-4 pl-6 pr-8 my-6 w-fit items-center bg-primary rounded-bl-3xl">
            <Button
              isLink
              to="/research"
              variant="secondary"
              label="Rechercher"
              className="font-semibold"
              isHoverBgColor
            />
            <Button
              isLink
              to="/propose"
              variant="secondary"
              label="Proposer"
              className="font-semibold"
              isHoverBgColor
            />
          </div>
          <div className="rounded-l-full rounded-br-full bg-gray-100 -ml-4 p-4 m-2 flex items-center justify-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              <img src={maleUser} alt="profile" width={80} />
            </button>
          </div>
        </nav>

        {/* Toggle Menu */}
        <div
          className={`hidden md:flex fixed md:top-[62px] md:bottom-auto transition-transform duration-300 ease-in-out transform right-0 z-40 w-fit h-18  p-2 rounded-tl-lg md:h-fit md:pt-10 md:rounded-bl-3xl bg-primary
        ${isOpen ? "translate-y-0 " : "!-translate-y-full"}
        `}
        >
          <div className="flex flex-col gap-4 p-4 w-full">
            {!me ? (
              <>
                <Button
                  isLink
                  to="/auth/signup"
                  label="Inscription"
                  className="font-semibold"
                  variant="secondary"
                  isHoverBgColor
                />
                <Button
                  isLink
                  to="/auth/signin"
                  label="Connexion"
                  className="font-semibold"
                  variant="secondary"
                  isHoverBgColor
                />
              </>
            ) : null}
            {me ? (
              <>
                <Button
                  isLink
                  to="/my-rides/passenger"
                  label="Trajets"
                  className="font-semibold w-full"
                  variant="secondary"
                  isHoverBgColor
                />
                <Button
                  label="Déconnexion"
                  className="font-semibold"
                  variant="secondary"
                  onClick={handleSignout}
                  isHoverBgColor
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
