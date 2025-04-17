import Button from "./Button";

const InformationMessage = () => {
  return (
    <div className="text-center text-white m-4">
      Vous devez être connectés pour proposer un trajet. Veuillez vous connecter
      ou créer un compte.
      <div className="flex justify-center gap-4 mt-4">
        <Button
          isLink
          to="/auth/inscription"
          label="Inscription"
          className="font-semibold"
          variant="secondary"
          isHoverBgColor
        />
        <Button
          isLink
          to="/auth/connexion"
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
