import { useEffect, useRef, useState } from "react";
import CardTemplate from "./CardTemplate";
import { VariantType } from "../types/variantTypes";
import { DriverRidesQuery, PassengerRidesQuery, SearchRidesQuery } from "../gql/graphql";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Keyboard, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper/modules";
import RideProvider from "../context/Rides/rides.provider";

type SearchRide = SearchRidesQuery["searchRides"][number];
type PassengerRide = PassengerRidesQuery["passengerRides"]["rides"][number];
type DriverRide = DriverRidesQuery["driverRides"]["rides"][number];

interface ScrollableSnapListProps {
  dataset: (SearchRide | PassengerRide | DriverRide)[];
  getVariant: (data: SearchRide | PassengerRide | DriverRide) => VariantType;
  onSelect: (index: number) => void;
  spaceBetween?: number;
  sliderDirection?: "vertical" | "horizontal";
  scaleEffect?: boolean;
  driverUpcomingRides?: boolean;
  centerSlides?: boolean;
  swiperClassName?: string;
  slidePerView?: number;
  navigationArrows?: boolean;
  showPagination?: boolean;
}

const ScrollableSnapList = ({
  dataset,
  getVariant,
  onSelect,
  spaceBetween = 0,
  sliderDirection = "horizontal",
  scaleEffect = false,
  driverUpcomingRides,
  centerSlides = false,
  swiperClassName = "",
  slidePerView = 3,
  navigationArrows,
  showPagination = false,
}: ScrollableSnapListProps) => {
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
      spaceBetween={spaceBetween}
      grabCursor={true}
      mousewheel={true}
      rewind={true}
      keyboard={{ enabled: true }}
      modules={[Keyboard, Mousewheel, Scrollbar, Navigation, Pagination]}
      className={`mySwiper w-full ${swiperClassName}`}
      scrollbar={{ hide: true, draggable: true }}
      slidesPerView={slidePerView}
      navigation={navigationArrows}
      pagination={showPagination ? { clickable: true } : false}
    >
      {dataset.map((data, index) => (
        <SwiperSlide
          key={index}
          className={`transition-transform duration-300 ease-in-out ${
            scaleEffect && index === selectedIndex ? "z-10 scale-105" : "z-0 scale-100"
          } flex h-auto min-h-[200px] w-full items-center justify-center`}
        >
          <RideProvider ride={data}>
            <CardTemplate
              variant={getVariant(data)}
              isSelected={index === selectedIndex}
              driverUpcomingRides={driverUpcomingRides}
              onClick={() => {
                swiperRef.current?.slideTo(index);
                setSelectedIndex(index);
                onSelect(index);
              }}
            />
          </RideProvider>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ScrollableSnapList;
