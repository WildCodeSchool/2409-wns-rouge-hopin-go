import { useState, useCallback } from "react";

/**
 * Hook de gestion de modale avec support d'animation d'apparition/disparition
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false); // Affichage DOM
  const [visible, setVisible] = useState(false); // Classe d'animation

  const openModal = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => setVisible(true), 10); // laisse le temps au DOM de s'afficher avant animation
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
    setTimeout(() => setIsOpen(false), 200); // attend fin d'animation
  }, []);

  const toggleModal = useCallback(() => {
    if (!isOpen) {
      openModal();
    } else {
      closeModal();
    }
  }, [isOpen, openModal, closeModal]);

  return {
    isOpen,
    visible,
    openModal,
    closeModal,
    toggleModal,
  };
};
