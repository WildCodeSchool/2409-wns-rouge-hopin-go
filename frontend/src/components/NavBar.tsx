import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { queryWhoAmI } from "../api/WhoAmI";
import { mutationSignout } from "../api/Signout";
import maleUser from "../assets/male-user.png";
import Button from "./Button";
import { CarFront, CirclePlus, CircleUserRound, Search } from "lucide-react";
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

  const closeNavBar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Version Mobile */}

      <div ref={toggleMenuRef}>
        {/* Toggle Menu */}
        <div
          className={`h-18 bg-primary fixed bottom-[58px] right-0 z-40 flex w-fit transform rounded-tl-lg p-2 transition-transform duration-300 ease-in-out md:bottom-0 md:hidden ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div
            className={`flex w-full flex-col gap-4 p-4 transition-opacity duration-300 ease-in-out ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {!me ? (
              <>
                <Button
                  onClick={closeNavBar}
                  isLink
                  to="/auth/signup"
                  label="Inscription"
                  className="font-semibold"
                  variant="secondary"
                />
                <Button
                  onClick={closeNavBar}
                  isLink
                  to="/auth/signin"
                  label="Connexion"
                  className="font-semibold"
                  variant="secondary"
                />
                <Button
                  onClick={closeNavBar}
                  isLink
                  to="/terms-of-service"
                  label="Mentions légales et CGU"
                  className="font-semibold"
                  variant="secondary"
                />
                <Button
                  onClick={closeNavBar}
                  isLink
                  to="/confidentiality-policy"
                  label="Politique de confidentialité"
                  className="font-semibold"
                  variant="secondary"
                />
              </>
            ) : null}
            {me ? (
              <>
                <Button
                  onClick={closeNavBar}
                  isLink
                  to="/my-account"
                  label="Mon compte"
                  className="font-semibold"
                  variant="secondary"
                />
                <Button
                  onClick={closeNavBar}
                  isLink
                  to="/terms-of-service"
                  label="Mentions légales et CGU"
                  className="font-semibold"
                  variant="secondary"
                />
                <Button
                  onClick={closeNavBar}
                  isLink
                  to="/confidentiality-policy"
                  label="Politique de confidentialité"
                  className="font-semibold"
                  variant="secondary"
                />
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
        <nav className="h-18 bg-primary text-secondary fixed bottom-0 left-0 right-0 z-50 flex w-full md:hidden">
          <div className="flex w-full items-center justify-around p-2">
            {me ? (
              <Button isLink to="/my-rides/passenger" icon={CarFront} iconSize={26} isFlexCol />
            ) : null}

            {/* {me ? (
              <Button
                isLink
                to="/"
                icon={MessageCircle}
                iconSize={26}
                isFlexCol
              />
            ) : null} */}

            <Button isLink to="/research" icon={Search} iconSize={26} isFlexCol />

            {me ? <Button isLink to="/propose" icon={CirclePlus} iconSize={26} isFlexCol /> : null}

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
        <nav className="fixed -right-4 -top-6 z-50 hidden justify-end overflow-hidden md:flex">
          <div className="bg-primary my-6 flex w-fit items-center justify-between gap-4 rounded-bl-3xl pl-6 pr-8">
            <Button
              isLink
              to="/research"
              variant="secondary"
              label="Rechercher"
              className="font-semibold"
              isHoverBgColor
              icon={Search}
            />
            <Button
              isLink
              to="/propose"
              variant="secondary"
              label="Proposer"
              className="font-semibold"
              isHoverBgColor
              icon={CirclePlus}
            />
          </div>
          <div className="relative m-2 -ml-4 flex flex-col items-center justify-center rounded-l-full rounded-br-full bg-gray-100 p-4">
            <button onClick={() => setIsOpen(!isOpen)}>
              <img src={maleUser} alt="profile" width={80} height={80} loading="lazy" />
            </button>
          </div>
        </nav>

        {/* Toggle Menu */}
        <div
          className={`h-18 bg-primary fixed right-0 z-40 hidden w-fit transform rounded-tl-lg p-2 transition-transform duration-300 ease-in-out md:bottom-auto md:top-[62px] md:flex md:h-fit md:rounded-bl-3xl md:pt-10 ${isOpen ? "translate-y-0" : "!-translate-y-full"} `}
        >
          <div className="flex w-full flex-col gap-4 p-4">
            {!me ? (
              <>
                <Button
                  onClick={() => setIsOpen(false)}
                  isLink
                  to="/auth/signup"
                  label="Inscription"
                  className="font-semibold"
                  variant="secondary"
                  isHoverBgColor
                />
                <Button
                  onClick={() => setIsOpen(false)}
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
                  className="w-full font-semibold"
                  variant="secondary"
                  isHoverBgColor
                />
                <Button
                  isLink
                  to="/my-account"
                  label="Mon compte"
                  className="w-full font-semibold"
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
