// non utilisé on se sert du composant
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { mutationSignin } from "../api/Signin";
import { useNavigate } from "react-router-dom";
import { queryWhoAmI } from "../api/WhoAmI";
import { Eye, EyeOff } from "lucide-react";
import Button from "./Button";

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
      className="max-w-sm mx-auto"
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
            {revealPassword ? (
              <Eye size="16" className="text-primary" />
            ) : (
              <EyeOff size="16" className="text-primary" />
            )}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      <div className="flex w-full justify-end">
        <Button variant="validation" type="submit" label="Connexion" />
      </div>
    </form>
  );
};

export default Signin;
