import Button from "./Button";

const InformationMessage = () => {
  return (
    <div className="flex h-full flex-col justify-center text-center text-white">
      Vous devez être connectés pour proposer un trajet. Veuillez vous connecter ou créer un compte.
      <div className="mt-4 flex justify-center gap-4">
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
