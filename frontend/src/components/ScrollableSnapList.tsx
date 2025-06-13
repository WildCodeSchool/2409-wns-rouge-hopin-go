import { useEffect, useRef, useState } from "react";
import CardTemplate from "./CardTemplate";
import { VariantType } from "../types/variantTypes";
import { SearchRidesQuery } from "../gql/graphql";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";

import { Keyboard, Mousewheel, Scrollbar } from "swiper/modules";

type SearchRide = SearchRidesQuery["searchRide"][number];

type ScrollableSnapListProps<T extends SearchRide> = {
  dataset: T[];
  getVariant: (data: T) => VariantType;
  onSelect: (index: number) => void;
  sliderDirection?: "vertical" | "horizontal";
  scaleEffect?: boolean;
  driverUpcomingRides?: boolean;
  centerSlides?: boolean;
  swiperClassName?: string;
  slidePerView?: number;
};

const ScrollableSnapList = <T extends SearchRide>({
  dataset,
  getVariant,
  onSelect,
  sliderDirection = "horizontal",
  scaleEffect = false,
  driverUpcomingRides,
  centerSlides = false,
  swiperClassName = "",
  slidePerView = 3,
}: ScrollableSnapListProps<T>) => {
  const swiperRef = useRef<SwiperType>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (swiperRef.current && dataset.length > 0) {
      swiperRef.current.slideTo(0);
      setSelectedIndex(0);
      onSelect(0);
    }
  }, [dataset, onSelect]);

  return (
    <Swiper
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onSlideChange={(swiper) => {
        const newIndex = swiper.realIndex;
        setSelectedIndex(newIndex);
        onSelect(newIndex);
      }}
      direction={sliderDirection}
      centeredSlides={centerSlides}
      spaceBetween={0}
      grabCursor={true}
      mousewheel={true}
      rewind={true}
      keyboard={{ enabled: true }}
      modules={[Keyboard, Mousewheel, Scrollbar]}
      className={`mySwiper  ${swiperClassName}`}
      scrollbar={{ hide: true, draggable: true }}
      slidesPerView={slidePerView}
    >
      {dataset.map((data, index) => (
        <SwiperSlide
          key={index}
          className={`transition-transform duration-300 ease-in-out
            ${
              scaleEffect && index === selectedIndex
                ? "scale-105 z-10"
                : "scale-100 z-0"
            }
            flex justify-center items-center
            h-auto min-h-[200px]`}
        >
          <CardTemplate
            variant={getVariant(data)}
            data={data}
            isSelected={index === selectedIndex}
            driverUpcomingRides={driverUpcomingRides}
            onClick={() => {
              swiperRef.current?.slideTo(index);
              setSelectedIndex(index);
              onSelect(index);
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ScrollableSnapList;
