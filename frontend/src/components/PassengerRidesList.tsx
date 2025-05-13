import { useState } from "react";
import CardTemplate from "./CardTemplate";
import { ChevronDown, ChevronUp } from "lucide-react";

const PassengerRidesList = ({ dataset }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <span
        className="flex items-center gap-2 text-white cursor-pointer"
        onClick={() => setToggle(!toggle)}
      >
        {toggle ? <ChevronUp color="white" /> : <ChevronDown color="white" />}
        Trajets à venir
      </span>
      {toggle && (
        <div className="flex w-full overflow-auto gap-4">
          {dataset.map((data) => (
            <CardTemplate key={data.id} variant="validation" data={data} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PassengerRidesList;
