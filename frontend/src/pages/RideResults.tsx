import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";
import CardTemplate, { CardData } from "../components/CardTemplate";
import CardRideDetails from "../components/CardRideDetails";
import { VariantType } from "../types/variantTypes";

const RideResults = () => {
  const dataset: CardData[] = [
    {
      departureTime: "16:10",
      arrivalTime: "17:40",
      departureCity: "Chambéry",
      arrivalCity: "Lyon",
      travelDuration: "1h30",
      driverName: "François-Xavier",
      price: 12.99,
      date: "30 septembre 2025",
      availableSeats: 2,
    },
    {
      departureTime: "9:30",
      arrivalTime: "11:30",
      departureCity: "Chambéry",
      arrivalCity: "Lyon",
      travelDuration: "2h",
      driverName: "Mireille",
      price: 16.5,
      date: "26 juillet 2023",
      availableSeats: 1,
    },
    {
      departureTime: "18:00",
      arrivalTime: "19:30",
      departureCity: "Annecy",
      arrivalCity: "Grenoble",
      travelDuration: "1h30",
      driverName: "Pierre",
      price: 10,
      date: "10 avril 2025",
      availableSeats: 0,
    },
    {
      departureTime: "18:00",
      arrivalTime: "19:30",
      departureCity: "Annecy",
      arrivalCity: "Grenoble",
      travelDuration: "1h30",
      driverName: "Pierre",
      price: 10,
      date: "10 avril 2025",
      availableSeats: 0,
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const getVariant = (data: CardData): VariantType => {
    if (data.availableSeats === 0) return "error";

    const today = new Date();
    const [jour, moisNom, annee] = data.date.split(" ");
    const moisMap: Record<string, number> = {
      janvier: 0,
      février: 1,
      mars: 2,
      avril: 3,
      mai: 4,
      juin: 5,
      juillet: 6,
      août: 7,
      septembre: 8,
      octobre: 9,
      novembre: 10,
      décembre: 11,
    };

    const parsedDate = new Date(+annee, moisMap[moisNom.toLowerCase()], +jour);
    return parsedDate < today ? "validation" : "pending";
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-screen p-4">
      {/* Swiper vertical */}
      <div className="flex-1 h-full max-h-full overflow-hidden">
        <Swiper
          direction="vertical"
          modules={[Scrollbar]}
          scrollbar={{ draggable: true }}
          slidesPerView={3.2}
          spaceBetween={0}
          onSlideChange={(swiper) => {
            setSelectedIndex(swiper.activeIndex);
          }}
          style={{ height: "100%" }} // ⬅️ Important !
        >
          {dataset.map((data, index) => (
            <SwiperSlide key={index} style={{ height: "auto" }}>
              <CardTemplate
                variant={getVariant(data)}
                data={data}
                isSelected={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Détails à droite */}
      <div className="w-full md:w-[400px]">
        <CardRideDetails
          variant={getVariant(dataset[selectedIndex])}
          data={dataset[selectedIndex]}
        />
      </div>
    </div>
  );
};

export default RideResults;
