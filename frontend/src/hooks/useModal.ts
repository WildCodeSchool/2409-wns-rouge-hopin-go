import { useState, useCallback } from "react";

export const useModal = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [visibleModals, setVisibleModals] = useState<Record<string, boolean>>(
    {}
  );

  const openModal = useCallback((id: string) => {
    // Fermer toutes les autres modales (animation)
    setVisibleModals((prev) => {
      const newState: Record<string, boolean> = {};
      for (const key of Object.keys(prev)) {
        newState[key] = false;
      }
      setActiveModal(id);
      return newState;
    });

    // Ouvrir la nouvelle après l'animation de fermeture
    setTimeout(() => {
      setVisibleModals((prev) => ({ ...prev, [id]: true }));
    }, 200);
  }, []);

  const closeModal = useCallback(
    (id: string) => {
      setVisibleModals((prev) => ({ ...prev, [id]: false }));
      setTimeout(() => {
        if (activeModal === id) {
          setActiveModal(null);
        }
      }, 200);
    },
    [activeModal]
  );

  const toggleModal = useCallback(
    (id: string) => {
      if (activeModal === id) {
        closeModal(id);
      } else {
        openModal(id);
      }
    },
    [activeModal, openModal, closeModal]
  );

  const isOpen = useCallback((id: string) => activeModal === id, [activeModal]);
  const isVisible = useCallback(
    (id: string) => !!visibleModals[id],
    [visibleModals]
  );

  return {
    activeModal,
    isOpen,
    isVisible,
    openModal,
    closeModal,
    toggleModal,
  };
};
