import { useEffect, useRef, useState } from "react";
import CardTemplate from "./CardTemplate";
import { VariantType } from "../types/variantTypes";
import useWindowSize from "../utils/useWindowSize";
import { Ride } from "../gql/graphql";

type ScrollableSnapListProps = {
  dataset: Ride[];
  getVariant: (data: Ride) => VariantType;
  onSelect: (index: number) => void;
  direction?: "vertical" | "horizontal";
  scaleEffect?: boolean;
};

const ScrollableSnapList: React.FC<ScrollableSnapListProps> = ({
  dataset,
  getVariant,
  onSelect,
  direction = "vertical",
  scaleEffect = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { isMd, isLg } = useWindowSize();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [padding, setPadding] = useState(0);
  const [bottomPadding, setBottomPadding] = useState(0);
  const [isScrollingManually, setIsScrollingManually] = useState(false);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isVertical = direction === "vertical";

  useEffect(() => {
    const container = containerRef.current;
    const firstItem = itemRefs.current[0];
    if (!container || !firstItem) return;

    const updatePadding = () => {
      const containerSize = isVertical
        ? container.clientHeight
        : container.clientWidth;
      const itemSize = isVertical
        ? firstItem.offsetHeight
        : firstItem.offsetWidth;

      const mobileNavbarOffset = 58;
      const pad = isMd ? containerSize / 2 - itemSize / 2 : 0;

      setPadding(pad);
      setBottomPadding(isMd ? pad : mobileNavbarOffset);
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, [dataset, isMd, isVertical]);

  const scrollToCenter = (index: number) => {
    const container = containerRef.current;
    const target = itemRefs.current[index];
    if (!container || !target) return;

    const containerSize = isVertical
      ? container.clientHeight
      : container.clientWidth;
    const targetOffset = isVertical ? target.offsetTop : target.offsetLeft;
    const targetSize = isVertical ? target.offsetHeight : target.offsetWidth;

    const scrollPosition =
      targetOffset - 5 - containerSize / 2 + targetSize / 2;

    if (isVertical) {
      container.scrollTo({ top: scrollPosition, behavior: "smooth" });
    } else {
      container.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }

    setIsScrollingManually(false);
  };

  const handleScroll = () => {
    if (isScrollingManually) return;

    const container = containerRef.current;
    if (!container) return;

    const center = isVertical
      ? container.scrollTop + container.clientHeight / 2
      : container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;

      const elOffset = isVertical ? el.offsetTop : el.offsetLeft;
      const elCenter =
        elOffset + (isVertical ? el.offsetHeight : el.offsetWidth) / 2;
      const distance = Math.abs(elCenter - center);

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
      }, 200);
    }
  };

  return (
    <div className="relative w-full h-full z-30 transition-200">
      <div
        ref={containerRef}
        className={`
          flex ${isVertical ? "flex-col" : "flex-row"}
          items-center gap-4 scroll-smooth h-full w-full no-scrollbar transition-200
          ${isVertical ? "overflow-y-scroll " : "overflow-x-scroll "}
        `}
        style={
          isVertical
            ? { paddingTop: padding, paddingBottom: bottomPadding }
            : { paddingLeft: 20, paddingRight: 20 }
        }
        onScroll={handleScroll}
      >
        {dataset?.map((data, index) => (
          <div
            className={` h-full ${isVertical ? "w-full sm:w-auto" : ""}  `}
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
          >
            <CardTemplate
              additionalClassName={`${
                scaleEffect &&
                (selectedIndex && isLg
                  ? "scale-110"
                  : selectedIndex && isMd
                  ? "scale-105"
                  : "")
              } `}
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
                }, 1000);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableSnapList;
