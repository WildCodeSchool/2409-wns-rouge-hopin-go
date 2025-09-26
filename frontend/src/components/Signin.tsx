import { useMutation } from "@apollo/client";
import { useState } from "react";
import { mutationSignin } from "../api/Signin";
import { useNavigate } from "react-router-dom";
import { queryWhoAmI } from "../api/WhoAmI";
import { Eye, EyeOff } from "lucide-react";
import {
  validateEmail as validateEmailUtils,
  validatePassword as validatePasswordUtils,
} from "../utils/validators";
import Button from "./Button";
import { formatErrors } from "../utils/formatErrors";
import { toast } from "react-toastify";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Nuagebleu73!");
  const [revealPassword, setRevealPassword] = useState(false);
  const [error, setError] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();

  const [doSignin] = useMutation(mutationSignin, {
    refetchQueries: [queryWhoAmI],
  });

  const validateCreateForm = (): boolean => {
    const emailErrors = validateEmailUtils(email);
    const passwordErrors = validatePasswordUtils(password);

    // Mise à jour de l'état des erreurs une seule fois (plus clean !)
    setError({
      email: emailErrors,
      password: passwordErrors,
    });

    // Retourne true si TOUT est valide
    return [emailErrors, passwordErrors].every((errors) => errors.length === 0);
  };

  // Gestion de la soumission
  async function doSubmit() {
    if (!validateCreateForm()) {
      return;
    }
    try {
      const { data } = await doSignin({
        variables: {
          email,
          password,
        },
      });
      setError({});
      if (data?.signin) {
        toast.success("Connexion réussie !");
        navigate(`/`, { replace: true });
      } else {
        setError((prev) => ({
          ...prev,
          general: ["Adresse email ou mot de passe incorrect"],
        }));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      setError((prev) => ({
        ...prev,
        general: ["Une erreur est survenue. Veuillez réessayer plus tard."],
      }));
    }
  }
  return (
    <form
      noValidate
      className=" h-full w-full flex flex-col justify-center items-center max-w-sm mx-auto px-4 sm:px-0"
      onSubmit={(e) => {
        e.preventDefault();
        doSubmit();
      }}
    >
      <div className="mb-5 w-full">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-white "
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className={`${
            error.email?.length
              ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
              : "border-gray-300 bg-gray-50"
          } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="nom@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="none"
          required
          aria-describedby={error.email ? "email-error" : undefined}
        />
        {error.email && (
          <p id="email-error" className="text-red-400 text-sm">
            {formatErrors(error.email)}
          </p>
        )}
      </div>
      {/* Mot de passe */}
      <div className="mb-5 w-full">
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
            required
            className={`${
              error.password?.length
                ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                : "border-gray-300 bg-gray-50"
            } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby={error.password ? "password-error" : undefined}
          />

          <button
            type="button"
            className=" -ml-8"
            onClick={() => setRevealPassword(!revealPassword)}
            aria-label={
              revealPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {revealPassword ? (
              <Eye size="16" className="text-primary" />
            ) : (
              <EyeOff size="16" className="text-primary" />
            )}
          </button>
        </div>
      </div>
      {error.password && (
        <p className="text-red-400 text-sm">{formatErrors(error.password)}</p>
      )}
      {error.general && (
        <p role="alert" className="text-red-500 mt-4 text-sm">
          {formatErrors(error.general)}
        </p>
      )}
      <div className="flex w-full justify-end">
        <Button variant="validation" type="submit" label="Connexion" />
      </div>
    </form>
  );
};

export default Signin;
