import { useMutation } from "@apollo/client";
import { mutationCreateUser } from "../api/CreateUser";
import { useState } from "react";
import Button from "../components/Button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import {
  validateFirstName as validateFirstNameUtils,
  validateLastName as validateLastNameUtils,
  validateEmail as validateEmailUtils,
  validatePassword as validatePasswordUtils,
  validateConfirmPassword as validateConfirmPasswordUtils,
} from "../utils/validators";

export default function Signup() {
  const [firstName, setFirstName] = useState("Adrien");
  const [lastName, setLastName] = useState("Davy");
  const [email, setEmail] = useState("adri@mail.com");
  const [password, setPassword] = useState("Nuagebleu73!");
  const [confirmPassword, setConfirmPassword] = useState("Nuagebleu73!");
  const [error, setError] = useState<Record<string, string[]>>({});
  const [revealPassword, setRevealPassword] = useState(false);

  const [doCreateUser, { data }] = useMutation(mutationCreateUser);

  // Fonction pour regrouper les erreurs en une phrase
  const formatErrors = (errors: string[]) => {
    if (errors.length === 0) return "";
    if (errors.length === 1) return errors[0];
    const lastError = errors.pop();
    return `${errors.join(", ")} et ${lastError}.`;
  };

  const validateCreateForm = (): boolean => {
    const firstNameErrors = validateFirstNameUtils(firstName);
    const lastNameErrors = validateLastNameUtils(lastName);
    const emailErrors = validateEmailUtils(email);
    const passwordErrors = validatePasswordUtils(password);
    const confirmPasswordErrors = validateConfirmPasswordUtils(
      password,
      confirmPassword
    );

    // Mise à jour de l'état des erreurs une seule fois (plus clean !)
    setError({
      firstName: firstNameErrors,
      lastName: lastNameErrors,
      email: emailErrors,
      password: passwordErrors,
      confirmPassword: confirmPasswordErrors,
    });

    // Retourne true si TOUT est valide
    return [
      firstNameErrors,
      lastNameErrors,
      emailErrors,
      passwordErrors,
      confirmPasswordErrors,
    ].every((errors) => errors.length === 0);
  };
  // Gestion de la soumission
  async function doSubmit() {
    if (!validateCreateForm()) {
      return;
    }
    console.log("doSubmit");

    try {
      await doCreateUser({
        variables: {
          data: {
            firstName,
            lastName,
            email,
            password,
          },
        },
      });
      toast.success("Inscription réussie !");
      setError({});
    } catch (e: unknown) {
      console.error(e);
      setError({
        form: ["Une erreur est survenue lors de l'inscription. Réessayez."],
      });
    }
  }

  if (data) {
    return (
      <div>
        <h1>Inscription réussie !</h1>
        <p>Ton compte a été créé !! 🎉</p>
      </div>
    );
  }

  return (
    <form className="max-w-sm mx-auto">
      {/* Prénom */}
      <div className="mb-5">
        <label
          htmlFor="first-name"
          className="block mb-2 text-sm font-medium text-textLight"
        >
          Prénom
        </label>
        <input
          type="text"
          id="first-name"
          minLength={2}
          maxLength={50}
          required
          className={`${
            error.firstName?.length
              ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
              : "border-gray-300 bg-gray-50"
          } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Jean"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {error.firstName && (
          <p className="text-red-400 text-sm">
            {formatErrors(error.firstName)}
          </p>
        )}
      </div>

      {/* Nom */}
      <div className="mb-5">
        <label
          htmlFor="last-name"
          className="block mb-2 text-sm font-medium text-white"
        >
          Nom
        </label>
        <input
          type="text"
          id="last-name"
          min="2"
          max="100"
          required
          maxLength={100}
          className={`${
            error.lastName?.length
              ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
              : "border-gray-300 bg-gray-50"
          } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Dupont"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {error.lastName && (
          <p className="text-red-400 text-sm">{formatErrors(error.lastName)}</p>
        )}
      </div>
      {/* Email */}
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
          className={`${
            error.email?.length
              ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
              : "border-gray-300 bg-gray-50"
          } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="nom@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="none"
        />
        {error.email && (
          <p className="text-red-400 text-sm">{formatErrors(error.email)}</p>
        )}
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
            className={`${
              error.password?.length
                ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                : "border-gray-300 bg-gray-50"
            } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className=" -ml-8"
            onClick={() => setRevealPassword(!revealPassword)}
          >
            {revealPassword ? (
              <Eye size={16} className=" text-primary" />
            ) : (
              <EyeOff size={16} className=" text-primary" />
            )}
          </button>
        </div>
        {error.password && (
          <p className="text-red-400 text-sm">{formatErrors(error.password)}</p>
        )}
      </div>

      {/* Confirmation du mot de passe */}
      <div className="mb-10">
        <label
          htmlFor="repeat-password"
          className="block mb-2 text-sm font-medium text-white"
        >
          Confirmer mot de passe
        </label>
        <div className="flex items-center">
          <input
            type={revealPassword ? "text" : "password"}
            id="repeat-password"
            className={`${
              error.confirmPassword?.length
                ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                : "border-gray-300 bg-gray-50"
            } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className=" -ml-8"
            onClick={() => setRevealPassword(!revealPassword)}
          >
            {revealPassword ? (
              <Eye size={16} className=" text-primary" />
            ) : (
              <EyeOff size={16} className=" text-primary" />
            )}
          </button>
        </div>
        {error.confirmPassword && (
          <p className="text-red-400 text-sm">
            {formatErrors(error.confirmPassword)}
          </p>
        )}
      </div>

      {/* Bouton */}
      <div className="flex w-full justify-end">
        <Button
          onClick={doSubmit}
          variant="validation"
          type="button"
          label="S'inscrire"
        />
      </div>
    </form>
  );
}
