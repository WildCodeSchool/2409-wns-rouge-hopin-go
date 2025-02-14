import { useMutation } from "@apollo/client";
import { useState } from "react";
import { mutationSignin } from "../api/Signin";
import { useNavigate } from "react-router-dom";
import { queryWhoAmI } from "../api/WhoAmI";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [revealPassword, setRevealPassword] = useState(false);
  const navigate = useNavigate();

  const [doSignin] = useMutation(mutationSignin, {
    refetchQueries: [queryWhoAmI],
  });

  // Gestion de la soumission
  async function doSubmit() {
    try {
      const { data } = await doSignin({
        variables: {
          email,
          password,
        },
      });
      setError("");
      if (data?.signin) {
        // connected
        console.log(data.signin);
        navigate(`/`, { replace: true });
      } else {
        setError("Impossible de vous connecter");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      setError("Identification échouée");
    }
  }

  return (
    <form
      className="max-w-sm mx-auto bg-yellow-500 p-8 rounded-xl shadow-lg"
      onSubmit={(e) => {
        e.preventDefault();
        doSubmit();
      }}
    >
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-white "
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className={`border-gray-300 bg-gray-50 shadow-sm border text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="nom@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="none"
        />
      </div>

      {/* Mot de passe */}
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-white dark:text-white"
        >
          Mot de passe
        </label>
        <div className="flex">
          <input
            type={revealPassword ? "text" : "password"}
            id="password"
            className={`border-gray-300 bg-gray-50 shadow-sm border text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className=" -ml-8"
            onClick={() => setRevealPassword(!revealPassword)}
          >
            {revealPassword ? "🐵" : "🙈"}
          </button>
        </div>
      </div>

      <button className="text-black bg-white hover:bg-gray-100 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
        Connexion
      </button>
      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
    </form>
  );
};

export default Signin;
