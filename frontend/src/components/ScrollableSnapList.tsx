// ✅ ScrollableSnapList : aligne dynamiquement une CardTemplate avec CardRideDetails

import { useEffect, useRef, useState } from "react";
import CardTemplate, { CardData } from "./CardTemplate";
import { VariantType } from "../types/variantTypes";

type ScrollableSnapListProps = {
  dataset: CardData[];
  getVariant: (data: CardData) => VariantType;
  onSelect: (index: number) => void;
  alignRef: React.RefObject<HTMLDivElement>; // 📌 Point d'ancrage visuel (CardRideDetails)
};

const ScrollableSnapList: React.FC<ScrollableSnapListProps> = ({
  dataset,
  getVariant,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [firstItem, setFirstItem] = useState<HTMLDivElement | null>(null);

  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    if (firstItem) {
      setCardHeight(firstItem.offsetHeight);
    }
  }, [firstItem]);

  // Mesure du scroll en fonction de la position de alignRef (CardRideDetails)
  const scrollToAlignWithDetails = (index: number) => {
    const container = containerRef.current;
    const target = itemRefs.current[index];
    if (!container || !target) return;

    const containerHeight = container.clientHeight;
    const targetOffsetTop = target.offsetTop;
    const targetHeight = target.clientHeight;

    const scrollTop = targetOffsetTop - containerHeight / 2 + targetHeight / 2;

    container.scrollTo({ top: scrollTop, behavior: "smooth" });
  };

  return (
    <div className="relative h-full w-full z-30">
      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-4 overflow-y-scroll scroll-smooth h-full no-scrollbar my-2"
        style={{ paddingTop: cardHeight + 54, paddingBottom: cardHeight + 54 }}
      >
        {dataset.map((data, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
              if (index === 0) setFirstItem(el);
            }}
          >
            <CardTemplate
              variant={getVariant(data)}
              data={data}
              isSelected={index === selectedIndex}
              onClick={() => {
                setSelectedIndex(index);
                onSelect(index);
                scrollToAlignWithDetails(index);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableSnapList;
