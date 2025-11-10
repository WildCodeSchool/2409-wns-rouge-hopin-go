import Button from "./Button";

const Footer = () => {
  return (
    <div className="bg-primary text-secondary fixed bottom-0 z-50 hidden w-full items-center justify-evenly gap-4 px-4 md:flex">
      <p className="text-xs">© 2025 Hopin'Go - Tous droits réservés</p>
      <div className="flex gap-4">
        <Button
          isLink
          to="/terms-of-service"
          variant="primary"
          label="Mentions légales et CGU"
          className="!text-xs"
          isBgTransparent
        />
        <Button
          isLink
          to="/confidentiality-policy"
          variant="primary"
          label="Politique de confidentialité"
          className="!text-xs"
          isBgTransparent
        />
      </div>
    </div>
  );
};

export default Footer;
