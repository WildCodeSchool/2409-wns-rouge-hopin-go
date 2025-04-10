import { useEffect, useRef, useState } from "react";
import CardTemplate, { CardData } from "./CardTemplate";
import { VariantType } from "../types/variantTypes";

type ScrollableSnapListProps = {
  dataset: CardData[];
  getVariant: (data: CardData) => VariantType;
  onSelect: (index: number) => void;
  alignRef: React.RefObject<HTMLDivElement>; // Pour alignement éventuel
};

const ScrollableSnapList: React.FC<ScrollableSnapListProps> = ({
  dataset,
  getVariant,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [padding, setPadding] = useState(200); // Valeur de secours
  const [isScrollingManually, setIsScrollingManually] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calcule le padding haut/bas dynamiquement
  useEffect(() => {
    const container = containerRef.current;
    const firstItem = itemRefs.current[0];
    if (!container || !firstItem) return;

    const updatePadding = () => {
      const containerHeight = container.clientHeight;
      const itemHeight = firstItem.offsetHeight;
      const pad = containerHeight / 2 - itemHeight / 2;
      setPadding(pad);
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, [dataset]);

  // Scroll smooth vers le centre
  const scrollToCenter = (index: number) => {
    const container = containerRef.current;
    const target = itemRefs.current[index];
    if (!container || !target) return;

    const containerHeight = container.clientHeight;
    const targetTop = target.offsetTop;
    const targetHeight = target.offsetHeight;

    const scrollTop = targetTop - containerHeight / 2 + targetHeight / 2;
    container.scrollTo({ top: scrollTop, behavior: "smooth" });
    setIsScrollingManually(false);
  };

  // Auto-sélection de la carte la plus proche du centre quand on scroll
  const handleScroll = () => {
    if (isScrollingManually) return;

    const container = containerRef.current;
    if (!container) return;

    const centerY = container.scrollTop + container.clientHeight / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const elTop = el.offsetTop;
      const elCenter = elTop + el.offsetHeight / 2;
      const distance = Math.abs(elCenter - centerY);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });

    if (closestIndex !== selectedIndex) {
      setSelectedIndex(closestIndex);
      onSelect(closestIndex);

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        scrollToCenter(closestIndex);
      }, 150);
    }
  };

  return (
    <div className="relative h-full w-full z-30">
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-4 overflow-y-scroll scroll-smooth h-full no-scrollbar my-2"
        style={{ paddingTop: padding, paddingBottom: padding }}
        onScroll={handleScroll}
      >
        {dataset.map((data, index) => (
          <div key={index} ref={(el) => (itemRefs.current[index] = el)}>
            <CardTemplate
              variant={getVariant(data)}
              data={data}
              isSelected={index === selectedIndex}
              onClick={() => {
                setSelectedIndex(index);
                onSelect(index);
                scrollToCenter(index);
                setIsScrollingManually(true);
                setTimeout(() => {
                  setIsScrollingManually(false);
                }, 500); // Timeout pour éviter le scroll immédiat
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableSnapList;
