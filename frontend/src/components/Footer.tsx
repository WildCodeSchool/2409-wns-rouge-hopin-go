import Button from "./Button"

const Footer = () => {
  return (
    <div className='hidden fixed bottom-0 md:flex justify-evenly items-center px-4 gap-4 w-full bg-primary text-secondary'>
      <p className="text-xs">© 2025 Hopin'Go - Tous droits réservés</p>
      <div className='flex gap-4'>
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
  )
}

export default Footer
