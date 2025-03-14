import Button from "../components/Button";
import CardTemplate from "../components/CardTemplate";

const Home = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        Page Home
        <CardTemplate variant="cancel" />
      </div>

      <Button
        label="Click me"
        onClick={() => console.log("Button clicked")}
        isLink
        to="/"
        isHoverBgColor
      />
    </>
  );
};

export default Home;
