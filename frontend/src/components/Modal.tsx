import { useRef } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";

type ModalProps = {
  isOpen: boolean;
  visible: boolean;
  toggleModal: () => void;
  children: (toggleModal: () => void) => React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  visible,
  toggleModal,
  children,
}) => {
  const toggleModalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(
    toggleModalRef,
    () => {
      if (isOpen) toggleModal();
    },
    isOpen
  );

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" />}

      {isOpen && (
        <div
          ref={toggleModalRef}
          className={`transition-200 fixed top-1/2 left-1/2 z-50 transform overflow-hidden rounded-2xl bg-white shadow-xl -translate-x-1/2 ${
            visible
              ? "opacity-100 -translate-y-1/2 pointer-events-auto"
              : "opacity-0 -translate-y-[55%] pointer-events-none"
          }`}
        >
          {children(toggleModal)}
        </div>
      )}
    </>
  );
};

export default Modal;

// UTILISATION :

// IMPORTEZ LE HOOK useModal DANS VOTRE COMPONENT --------------------------------------------------

// import { useModal } from "../hooks/useModal";
//  const { isOpen, visible, toggleModal } = useModal();

// DEMONSTRATION D'UNE MODALE AVEC UN BOUTON DE FERMETURE ------------------------------------------

// import { X } from "react-feather";

// <Modal isOpen={isOpen} visible={visible} toggleModal={toggleModal}>
// {(toggleModal) => (
//   <div className="relative flex flex-col items-center justify-center h-full bg-purple-500 p-4">
//     <Button
//       icon={X}
//       iconSize={26}
//       type="button"
//       variant="error"
//       isBgTransparent
//       onClick={toggleModal}
//       className="hover:!bg-primaryHover self-end mb-4"
//     />
//     <div className="flex flex-col items-center justify-center">
//       <h1 className="text-2xl font-bold">
//         Bienvenue sur notre plateforme de covoiturage !
//       </h1>
//       <p className="text-lg">
//         Connectez-vous pour profiter de toutes nos fonctionnalités.
//       </p>
//     </div>
//   </div>
// )}
// </Modal>

// EXEMPLE DE BOUTON POUR OUVRIR LA MODALE --------------------------------------------------

// <Button
// label=" Test pour ouvrir une modale"
// type="button"
// onClick={toggleModal}
// />
