import { useMutation, useQuery } from "@apollo/client";
import { queryWhoAmI } from "../api/WhoAmI";
import { Eye, EyeOff } from "lucide-react";
import { formatErrors } from "../utils/formatErrors";
import { useEffect, useState } from "react";
import {
  validateEmail as validateEmailUtils,
  validatePassword as validatePasswordUtils,
} from "../utils/validators";
import Button from "../components/Button";
import { mutationUpdateMyAccount } from "../api/UpdateMyAccount";
import { toast } from "react-toastify";

const MyAccount = () => {
  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;

  const [doUpdate, { loading }] = useMutation(mutationUpdateMyAccount, {
    refetchQueries: [queryWhoAmI],
  });

  // états contrôlés
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [error, setError] = useState<Record<string, string[]>>({});

  // hydrate quand whoami arrive
  useEffect(() => {
    if (me?.email) setEmail(me.email);
  }, [me?.email]);

  const validate = (): boolean => {
    const emailErrors = email ? validateEmailUtils(email) : [];
    const passwordErrors = password ? validatePasswordUtils(password) : [];
    setError({ email: emailErrors, password: passwordErrors });
    // OK si pas d’erreurs locales
    return emailErrors.length === 0 && passwordErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    // construit le patch: n’envoie que ce qui change
    const data: Record<string, string> = {};
    if (email && email !== me?.email) data.email = email;
    if (password) data.password = password;

    if (Object.keys(data).length === 0) {
      setError({ general: ["Aucune modification à enregistrer."] });
      setTimeout(() => setError({}), 3000);
      return;
    }

    try {
      await doUpdate({ variables: { data } });
      toast.success("Compte mis à jour avec succès !");
      setPassword(""); // reset champ sensible
      setError({});
    } catch (e: unknown) {
      toast.error("Erreur lors de la mise à jour du compte.");
      setError({
        general: [
          (e as { message?: string }).message ?? "Une erreur est survenue.",
        ],
      });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center pt-20 px-4">
      <div className="flex flex-col items-center rounded-lg p-8 shadow-lg bg-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8">Mon Compte</h1>

        {me && (
          <form
            className="flex flex-col w-full gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2>Bienvenue {me.firstName} !</h2>

            <label className="block mb-2 mt-4 font-semibold" htmlFor="email">
              Email :
            </label>
            <input
              type="email"
              id="email"
              value={email} // ← contrôlé
              onChange={(e) => setEmail(e.target.value)}
              className={`border p-2 rounded-md w-full ${
                error.email?.length
                  ? "border-error bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {error.email?.length ? (
              <p className="text-red-400 text-sm">
                {formatErrors(error.email)}
              </p>
            ) : null}

            <label className="block mb-2 mt-4 font-semibold" htmlFor="password">
              Mot de passe :
            </label>
            <div className="flex">
              <input
                type={revealPassword ? "text" : "password"}
                id="password"
                className={`shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5 ${
                  error.password?.length
                    ? "border-error bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                value={password} // ← contrôlé
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe (laissez vide pour ne pas changer)"
                aria-describedby={error.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className="-ml-8"
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
            {error.password?.length ? (
              <p id="password-error" className="text-red-400 text-sm">
                {formatErrors(error.password)}
              </p>
            ) : null}

            {error.general && (
              <p role="alert" className="text-red-500 mt-2 text-sm">
                {formatErrors(error.general)}
              </p>
            )}

            <Button
              type="submit"
              variant="validation"
              isHoverBgColor
              label={loading ? "Mise à jour..." : "Mettre à jour"}
              disabled={loading}
              onClick={handleSubmit} // ← on appelle vraiment la mutation
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
