import { useRef } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";

type ModalProps = {
  id: string; // Optionnel mais utile pour devtools, debug, data-* attr
  isOpen: boolean;
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  id,
  isOpen,
  isVisible,
  onClose,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(
    ref,
    () => {
      if (isOpen) onClose();
    },
    isOpen
  );

  return createPortal(
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[50]" data-modal-overlay />
      )}
      {isOpen && (
        <div
          ref={ref}
          data-modal-id={id}
          onClick={(e) => e.stopPropagation()}
          className={`fixed top-1/2 left-1/2 z-50 transform transition-all duration-200 -translate-x-1/2
            ${
              isVisible
                ? "opacity-100 -translate-y-1/2 pointer-events-auto"
                : "opacity-0 -translate-y-[55%] pointer-events-none"
            }`}
        >
          {children}
        </div>
      )}
    </>,
    document.body
  );
};

export default Modal;

// UTILISATION DANS UN AUTRE COMPOSANT

// import { useModal } from "../hooks/useModal";
// import Modal from "../components/Modal";

// const MyComponent = () => {
//   const { isOpen, isVisible, toggleModal, closeModal } = useModal();

//   return (
//     <>
//       <button onClick={() => toggleModal("modalA")}>Ouvrir Modal A</button>
//       <button onClick={() => toggleModal("modalB")}>Ouvrir Modal B</button>

//       <Modal
//         id="modalA"
//         isOpen={isOpen("modalA")}
//         isVisible={isVisible("modalA")}
//         onClose={() => closeModal("modalA")}
//       >
//         <div className="p-6 bg-white rounded shadow-lg">
//           <p>Contenu Modal A</p>
//         </div>
//       </Modal>

//       <Modal
//         id="modalB"
//         isOpen={isOpen("modalB")}
//         isVisible={isVisible("modalB")}
//         onClose={() => closeModal("modalB")}
//       >
//         <div className="p-6 bg-white rounded shadow-lg">
//           <p>Contenu Modal B</p>
//         </div>
//       </Modal>
//     </>
//   );
// };
