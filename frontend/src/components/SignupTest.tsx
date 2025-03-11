import { useMutation } from "@apollo/client";
import { mutationCreateUser } from "../api/CreateUser";
import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  // Fonction pour valider l'email dynamiquement
  const validateEmail = (value: string) => {
    const emailErrors: string[] = [];
    if (!value) {
      emailErrors.push("L'email est requis");
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
    ) {
      emailErrors.push(
        "L'email doit être au format valide, par exemple nom@mail.com"
      );
    }
    setError((prev) => ({ ...prev, email: emailErrors }));
    setEmail(value);
  };

  const validatePassword = (value: string) => {
    const conditions: string[] = [];

    if (!value) {
      setError((prev) => ({
        ...prev,
        password: ["Le mot de passe est requis"],
      }));
      setPassword(value);
      return;
    }

    if (value.length < 8) conditions.push("8 caractères");
    if (value.length > 32) conditions.push("moins de 32 caractères");
    if (!/[a-z]/.test(value)) conditions.push("une lettre minuscule");
    if (!/[A-Z]/.test(value)) conditions.push("une lettre majuscule");
    if (!/\d/.test(value)) conditions.push("un chiffre");
    if (!/[@$!%*?&]/.test(value))
      conditions.push("un caractère spécial (@$!%*?&)");

    const passwordErrors =
      conditions.length > 0
        ? [`Le mot de passe doit comporter au moins ${conditions.join(", ")}.`]
        : [];

    setError((prev) => ({ ...prev, password: passwordErrors }));
    setPassword(value);
  };

  // Fonction pour valider la confirmation du mot de passe dynamiquement
  const validateConfirmPassword = (value: string) => {
    const confirmPasswordErrors: string[] = [];
    if (value !== password) {
      confirmPasswordErrors.push("Les mots de passe ne correspondent pas");
    }
    setError((prev) => ({ ...prev, confirmPassword: confirmPasswordErrors }));
    setConfirmPassword(value);
  };

  // Validation complète avant la soumission
  const validateCreateForm = () => {
    validateEmail(email);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);
    return (
      Object.values(error).every((errArray) => errArray.length === 0) &&
      email &&
      password &&
      confirmPassword
    );
  };

  // Gestion de la soumission
  async function doSubmit() {
    if (!validateCreateForm()) {
      return;
    }

    try {
      await doCreateUser({
        variables: {
          data: {
            email,
            password,
          },
        },
      });
      setError({});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
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
    <form className="max-w-sm mx-auto bg-yellow-500 p-8 rounded-xl shadow-lg">
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
              ? "border-red-400 bg-red-200 focus:ring-0"
              : "border-gray-300 bg-gray-50"
          } shadow-sm border text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="nom@mail.com"
          value={email}
          onChange={(e) => validateEmail(e.target.value)}
          autoComplete="none"
        />
        {error.email && (
          <p className="text-red-500 text-sm">{formatErrors(error.email)}</p>
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
                ? "border-red-400 bg-red-200 focus:ring-0"
                : "border-gray-300 bg-gray-50"
            } shadow-sm border text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5`}
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
          />

          <button
            type="button"
            className=" -ml-8"
            onClick={() => setRevealPassword(!revealPassword)}
          >
            {revealPassword ? "🐵" : "🙈"}
          </button>
        </div>
        {error.password && (
          <p className="text-red-500 text-sm">{formatErrors(error.password)}</p>
        )}
      </div>

      {/* Confirmation du mot de passe */}
      <div className="mb-5">
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
                ? "border-red-400 bg-red-200 focus:ring-0"
                : "border-gray-300 bg-gray-50"
            } shadow-sm border text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5`}
            value={confirmPassword}
            onChange={(e) => validateConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className=" -ml-8"
            onClick={() => setRevealPassword(!revealPassword)}
          >
            {revealPassword ? "🐵" : "🙈"}
          </button>
        </div>
        {error.confirmPassword && (
          <p className="text-red-500 text-sm">
            {formatErrors(error.confirmPassword)}
          </p>
        )}
      </div>

      {/* Bouton */}
      <button
        onClick={doSubmit}
        type="button"
        className="text-black bg-white hover:bg-gray-100 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        M'inscrire
      </button>
    </form>
  );
};

export default Signup;
