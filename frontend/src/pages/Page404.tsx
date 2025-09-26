// import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div className="flex h-[90dvh] flex-col items-center justify-center overflow-hidden">
      <p className="fixed left-1/2 -translate-x-1/2 animate-pulse text-4xl font-extrabold text-black">
        Redirection vers la page d&apos;accueil...
      </p>
      <img
        src="https://h2.gifposter.com/gifs/kids/Aah-I-ain%C3%A2-t-sure.gif"
        alt=""
        width="100%"
        height="100%"
      />
      {/* Oups, la page que vous cherchez n'existe pas.
      <Link to="/">Retourner à l'accueil</Link> */}
    </div>
  );
};

export default Page404;
