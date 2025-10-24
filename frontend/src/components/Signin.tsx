import { useMutation } from "@apollo/client";
import { useState } from "react";
import { mutationSignin } from "../api/Signin";
import { useNavigate } from "react-router-dom";
import { queryWhoAmI } from "../api/WhoAmI";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import {
  validateEmail as validateEmailUtils,
  validatePassword as validatePasswordUtils,
} from "../utils/validators";
import Button from "./Button";
import { formatErrors } from "../utils/formatErrors";
import { toast } from "react-toastify";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [error, setError] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();

  const [doSignin, { loading }] = useMutation(mutationSignin, {
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
      const message = e.graphQLErrors?.[0]?.message || e.message;

      if (message === "Unverified Email") {
        setError((prev) => ({
          ...prev,
          general: ["Veuillez d'abord vérifier votre e-mail avant de vous connecter."],
        }));
      } else {
        setError((prev) => ({
          ...prev,
          general: ["Une erreur est survenue. Veuillez réessayer plus tard."],
        }));
      }
    }
  }
  return (
    <form
      noValidate
      className="mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center px-4 sm:p-8 sm:py-8"
      onSubmit={(e) => {
        e.preventDefault();
        doSubmit();
      }}
    >
      <div className="mb-5 w-full">
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
          Email
        </label>
        <input
          type="email"
          id="email"
          className={`${error.email?.length
              ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
              : "border-gray-300 bg-gray-50"
            } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none ${error.email && error.email.length > 0 && "border-full"
            }`}
          placeholder="nom@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="none"
          required
          aria-describedby={error.email ? "email-error" : undefined}
        />
        {error.email && error.email.length > 0 && (
          <p
            id="email-error"
            className="text-full mt-5 w-fit rounded-lg bg-gray-50 px-2 py-1 text-sm"
          >
            {formatErrors(error.email)}
          </p>
        )}
      </div>
      {/* Mot de passe */}
      <div className="mb-5 w-full">
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-white dark:text-white"
        >
          Mot de passe
        </label>
        <div className="flex">
          <input
            type={revealPassword ? "text" : "password"}
            id="password"
            required
            className={`${error.password?.length
                ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
                : "border-gray-300 bg-gray-50"
              } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none ${error.password && error.password.length > 0 && "border-full"
              }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby={error.password ? "password-error" : undefined}
          />

          <Button
            variant="secondary"
            type="button"
            className="!m-1 !-ml-[2.40rem] rounded-lg"
            onClick={() => setRevealPassword(!revealPassword)}
            aria-label={revealPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            icon={revealPassword ? Eye : EyeOff}
          />
        </div>
      </div>
      {error.password && error.password.length > 0 && (
        <p className="text-full w-fit self-start rounded-lg bg-gray-50 px-2 py-1 text-sm">
          {formatErrors(error.password)}
        </p>
      )}
      {error.general && (
        <p role="alert" className="text-full mt-4 w-fit rounded-lg bg-gray-50 p-2 text-sm">
          {formatErrors(error.general)}
        </p>
      )}
      <a href="/auth/forgot-password" className="text-sm hover:underline" style={{ color: "rgb(0, 236, 255)" }}>
        Mot de passe oublié ?
      </a>
      <div className="mt-5 flex w-full justify-end">
        <Button
          type="submit"
          disabled={loading}
          icon={loading ? LoaderCircle : undefined}
          iconRotateAnimation={loading}
          label={loading ? "Connexion..." : "Connexion"}
          variant={loading ? "pending" : "secondary"}
        />
      </div>
    </form>
  );
};

export default Signin;
