import { useMutation } from "@apollo/client";
import { mutationCreateUser } from "../api/CreateUser";
import { useState } from "react";
import Button from "../components/Button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import {
  validateFirstName as validateFirstNameUtils,
  validateLastName as validateLastNameUtils,
  validateEmail as validateEmailUtils,
  validatePassword as validatePasswordUtils,
  validateConfirmPassword as validateConfirmPasswordUtils,
} from "../utils/validators";
import { formatErrors } from "../utils/formatErrors";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<Record<string, string[]>>({});
  const [revealPassword, setRevealPassword] = useState(false);

  const [doCreateUser, { loading: loadingCreateUser }] = useMutation(mutationCreateUser);

  const validateCreateForm = (): boolean => {
    const firstNameErrors = validateFirstNameUtils(firstName);
    const lastNameErrors = validateLastNameUtils(lastName);
    const emailErrors = validateEmailUtils(email);
    const passwordErrors = validatePasswordUtils(password);
    const confirmPasswordErrors = validateConfirmPasswordUtils(password, confirmPassword);

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
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      toast.success("Inscription réussie ! Vous allez recevoir un mail pour valider votre compte.");
      setError({});
    } catch (e: any) {
      console.error(e);
      const message = e.graphQLErrors?.[0]?.message || e.message;

      if (message === "account not expired") {
        setError((prev) => ({
          ...prev,
          general: [
            "Un compte non vérifié existe déjà avec cet email. Consultez votre boîte mail pour valider votre inscription.",
          ],
        }));
      } else if (message === "account already verified") {
        setError((prev) => ({
          ...prev,
          general: ["Un utilisateur avec cet email existe déjà."],
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
    <form className="mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center px-4 sm:py-8">
      {/* Prénom */}
      <div className="mb-5 w-full">
        <label htmlFor="first-name" className="text-textLight mb-2 block text-sm font-medium">
          Prénom
        </label>
        <input
          type="text"
          id="first-name"
          minLength={2}
          maxLength={50}
          required
          className={`${error.firstName?.length
              ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
              : "border-gray-300 bg-gray-50"
            } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
          placeholder="Jean"
          value={firstName}
          onChange={(e) =>
            setFirstName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
          }
          aria-describedby={error.firstName ? "first-name-error" : undefined}
        />
        {error.firstName && error.firstName.length > 0 && (
          <p
            id="first-name-error"
            className="text-full mt-2 w-fit self-start rounded-lg bg-gray-50 px-2 py-1 text-sm"
          >
            {formatErrors(error.firstName)}
          </p>
        )}
      </div>

      {/* Nom */}
      <div className="mb-5 w-full">
        <label htmlFor="last-name" className="mb-2 block text-sm font-medium text-white">
          Nom
        </label>
        <input
          type="text"
          id="last-name"
          min="2"
          max="100"
          required
          maxLength={100}
          className={`${error.lastName?.length
              ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
              : "border-gray-300 bg-gray-50"
            } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
          placeholder="Dupont"
          value={lastName}
          onChange={(e) =>
            setLastName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
          }
          aria-describedby={error.lastName ? "last-name-error" : undefined}
        />
        {error.lastName && error.lastName.length > 0 && (
          <p
            id="last-name-error"
            className="text-full mt-2 w-fit self-start rounded-lg bg-gray-50 px-2 py-1 text-sm"
          >
            {formatErrors(error.lastName)}
          </p>
        )}
      </div>
      {/* Email */}
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
            } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
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
            className="text-full mt-2 w-fit self-start rounded-lg bg-gray-50 px-2 py-1 text-sm"
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
            className={`${error.password?.length
                ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
                : "border-gray-300 bg-gray-50"
              } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby={error.password ? "password-error" : undefined}
          />

          <button
            type="button"
            className="m-1 -ml-9 rounded-lg bg-gray-200 p-2"
            onClick={() => setRevealPassword(!revealPassword)}
            aria-label={revealPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {revealPassword ? (
              <Eye size={16} className="text-primary" />
            ) : (
              <EyeOff size={16} className="text-primary" />
            )}
          </button>
        </div>
        {error.password && error.password.length > 0 && (
          <p
            id="password-error"
            className="text-full mt-2 w-fit self-start rounded-lg bg-gray-50 px-2 py-1 text-sm"
          >
            {formatErrors(error.password)}
          </p>
        )}
      </div>

      {/* Confirmation du mot de passe */}
      <div className="mb-5 w-full">
        <label htmlFor="repeat-password" className="mb-2 block text-sm font-medium text-white">
          Confirmer mot de passe
        </label>
        <div className="flex items-center">
          <input
            type={revealPassword ? "text" : "password"}
            id="repeat-password"
            className={`${error.confirmPassword?.length
                ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
                : "border-gray-300 bg-gray-50"
              } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-describedby={error.confirmPassword ? "confirm-password-error" : undefined}
          />
          <button
            type="button"
            aria-label={revealPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="m-1 -ml-9 rounded-lg bg-gray-200 p-2"
            onClick={() => setRevealPassword(!revealPassword)}
          >
            {revealPassword ? (
              <Eye size={16} className="text-primary" />
            ) : (
              <EyeOff size={16} className="text-primary" />
            )}
          </button>
        </div>
        {error.confirmPassword && error.confirmPassword.length > 0 && (
          <p
            role="alert"
            id="confirm-password-error"
            className="text-full mt-2 w-fit self-start rounded-lg bg-gray-50 px-2 py-1 text-sm"
          >
            {formatErrors(error.confirmPassword)}
          </p>
        )}
      </div>
      {error.general && (
        <p role="alert" className="text-full mb-4 w-fit rounded-lg bg-gray-50 p-2 text-sm">
          {formatErrors(error.general)}
        </p>
      )}

      {/* Bouton */}
      <div className="flex w-full justify-end">
        <Button
          type="button"
          onClick={doSubmit}
          disabled={loadingCreateUser}
          icon={loadingCreateUser ? LoaderCircle : undefined}
          iconRotateAnimation={loadingCreateUser}
          label={loadingCreateUser ? "Inscription..." : "S'inscrire"}
          variant={loadingCreateUser ? "pending" : "secondary"}
        />
      </div>
    </form>
  );
}
