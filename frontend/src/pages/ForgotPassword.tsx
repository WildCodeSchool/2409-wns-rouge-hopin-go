import { useState } from "react";
import Button from "../components/Button";
import { validateEmail } from "../utils/validators";
import { formatErrors } from "../utils/formatErrors";
import { useMutation } from "@apollo/client";
import { mutationSendResetLink } from "../api/SendResetLink";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");

  const [doSendResetLink, { loading: loadingSendResetLink }] = useMutation(
    mutationSendResetLink as any
  );

  async function doSubmit() {
    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
      setError(formatErrors(emailErrors));
      return;
    }

    try {
      await doSendResetLink({
        variables: {
          email,
        },
      });

      setEmail("");
      toast.success("Un lien de réinitialisation a été envoyé !");
      setError("");
    } catch (e: unknown) {
      console.error(e);
      setError("Une erreur est survenue lors de l'envoi du lien de réinitialisation. Réessayez."); // Probablement à enlever pour éviter les user enumeration attacks
    }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
      <div className="border-textDark bg-primary flex w-full max-w-md flex-col items-center gap-6 rounded-xl border px-6 py-6 text-white shadow-xl sm:max-w-xl sm:px-10">
        <h1 className="my-3 text-center text-2xl font-bold">Mot de passe oublié ?</h1>
        <p>
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation de mot de passe. Le
          lien est valide pendant 10 minutes.
        </p>
        <form action="" className="flex flex-col" style={{ width: "75%" }}>
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            className={`${
              error.length > 0
                ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
                : "border-gray-300 bg-gray-50"
            } text-textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
            placeholder="nom@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-describedby={error.length > 0 ? "email-error" : undefined}
          />
          {error.length > 0 && (
            <p
              id="email-error"
              className="text-full mt-2 w-fit self-start rounded-lg bg-gray-50 px-2 py-1 text-sm"
            >
              {error}
            </p>
          )}
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={doSubmit}
              disabled={loadingSendResetLink}
              icon={loadingSendResetLink ? LoaderCircle : undefined}
              iconRotateAnimation={loadingSendResetLink}
              label={loadingSendResetLink ? "Envoi en cours..." : "Envoyer le lien"}
              variant={loadingSendResetLink ? "pending" : "secondary"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
