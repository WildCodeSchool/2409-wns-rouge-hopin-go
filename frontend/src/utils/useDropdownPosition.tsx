import { useEffect, useState } from "react";

type DropdownClasses = {
  dropdownPosition: string;
  triggerClasses: string;
  dropdownClasses: string;
};

export const useDropdownPosition = <T extends HTMLElement>(
  triggerRef: React.RefObject<T>,
  dropdownRef: React.RefObject<HTMLUListElement>,
  triggerClassTop: string,
  triggerClassBottom: string,
  dropdownPositionTop: string,
  dropdownClassTop: string,
  dropdownPositionBottom: string,
  dropdownClassBottom: string
): DropdownClasses => {
  const [classes, setClasses] = useState<DropdownClasses>({
    dropdownPosition: dropdownPositionTop, // Default to top dropdown classes
    triggerClasses: triggerClassTop, // Default to top trigger classes
    dropdownClasses: dropdownClassTop, // Default to top dropdown classes
  });

  useEffect(() => {
    const updatePosition = () => {
      if (!triggerRef.current || !dropdownRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const fitsBelow = triggerRect.bottom + dropdownHeight <= viewportHeight;
      const fitsAbove = triggerRect.top - dropdownHeight >= 0;

      if (fitsBelow) {
        setClasses({
          dropdownPosition: dropdownPositionTop, // Default to top dropdown classes
          triggerClasses: triggerClassTop, // Default to top trigger classes
          dropdownClasses: dropdownClassTop,
        });
      } else if (fitsAbove) {
        setClasses({
          dropdownPosition: dropdownPositionBottom, // Default to top dropdown classes
          triggerClasses: triggerClassBottom, // Default to top trigger classes
          dropdownClasses: dropdownClassBottom,
        });
      } else {
        // Fallback to default if neither fits
        setClasses({
          dropdownPosition: dropdownPositionTop, // Default to top dropdown classes
          triggerClasses: triggerClassTop, // Default to top trigger classes
          dropdownClasses: dropdownClassTop,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [
    triggerRef,
    dropdownRef,
    triggerClassTop,
    triggerClassBottom,
    dropdownPositionTop,
    dropdownClassTop,
    dropdownPositionBottom,
    dropdownClassBottom,
  ]);

  return classes;
};
