import CardTemplate from "./CardTemplate";

const DriverRidesList = ({ dataset }) => {
  return (
    <div>
      Conducteur
      <CardTemplate variant="validation" data={dataset} />
    </div>
  );
};

export default DriverRidesList;
