import Button from "./Button";

const InformationMessage = () => {
  return (
    <div className=" flex flex-col justify-center h-full gap-8 text-center text-white">
      <p className="w-full max-w-sm mx-auto">
        Vous devez être connectés pour proposer un trajet. Veuillez vous
        connecter ou créer un compte.
      </p>
      <div className="flex justify-center gap-4 mt-4">
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
      </div>
    </div>
  );
};

export default InformationMessage;
