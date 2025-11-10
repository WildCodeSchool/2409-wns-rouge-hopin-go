import { useMutation } from "@apollo/client";
import { useState } from "react";
import Button from "../components/Button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { mutationResetPassword } from "../api/ResetPassword";
import { validateConfirmPassword, validatePassword } from "../utils/validators";
import { formatErrors } from "../utils/formatErrors";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<Record<string, string[]>>({});
  const [revealPassword, setRevealPassword] = useState(false);

  const [doResetPassword, { loading: loadingResetPassword }] = useMutation(mutationResetPassword as any);

  async function doSubmit() {
    const passwordErrors = validatePassword(password);
    const confirmPasswordErrors = validateConfirmPassword(password, confirmPassword);
    if (passwordErrors.length > 0 || confirmPasswordErrors.length > 0) {
      setError({
        password: passwordErrors,
        confirmPassword: confirmPasswordErrors,
      });
      return;
    }

    try {
      await doResetPassword({
        variables: {
          data: {
            password,
            resetToken
          },
        },
      });

      setPassword("");
      setConfirmPassword("");
      toast.success("Votre mot de passe a été réinitialisé avec succès !");
      setError({});
      navigate("/auth/signin");
    } catch (e: unknown) {
      console.error(e);
      toast.error("Le lien de réinitialisation est invalide ou a expiré.");
    }
  }

  return (
    <div className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center md:h-3/4 md:w-3/4">
      <div className="sm:border border-textDark sm:rounded-xl shadow-xl max-w-xl w-full overflow-hidden z-50">
        <div className="bg-primary px-10 w-full overflow-auto text-white flex flex-col items-center gap-4 py-6">
          <h1 className="text-2xl font-bold text-center my-3">Choisissez un nouveau mot de passe</h1>
          <p>Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.</p>
          <form action="" className="flex flex-col" style={{ width: "75%" }}>
            {/* Mot de passe */}
            <div>
              <label htmlFor="email">Mot de passe</label>
              <div className="flex">
                <input
                  type={revealPassword ? "text" : "password"}
                  id="password"
                  className={`${error.password?.length > 0
                    ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
                    : "border-gray-300 bg-gray-50"
                    } text-textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-describedby={error.password?.length > 0 ? "email-error" : undefined}
                />
                <button
                  type="button"
                  className="-ml-9 bg-gray-200 rounded-lg p-2 m-1"
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
              {error.password?.length > 0 && (
                <p id="email-error" className="text-full self-start text-sm bg-gray-50 px-2 py-1 rounded-lg w-fit mt-2">
                  {formatErrors(error.password)}
                </p>
              )}
            </div>
            {/* Confirmation du mot de passe */}
            <div>
              <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
              <div className="flex">
                <input
                  type={revealPassword ? "text" : "password"}
                  id="confirmPassword"
                  className={`${error.confirmPassword?.length > 0
                    ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
                    : "border-gray-300 bg-gray-50"
                    } text-textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
                  placeholder="Mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-describedby={error.confirmPassword?.length > 0 ? "email-error" : undefined}
                />
                <button
                  type="button"
                  className="-ml-9 bg-gray-200 rounded-lg p-2 m-1"
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
              {error.confirmPassword?.length > 0 && (
                <p id="email-error" className="text-full self-start text-sm bg-gray-50 px-2 py-1 rounded-lg w-fit mt-2">
                  {formatErrors(error.confirmPassword)}
                </p>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <Button
                type="button"
                onClick={doSubmit}
                disabled={loadingResetPassword}
                icon={loadingResetPassword ? LoaderCircle : undefined}
                iconRotateAnimation={loadingResetPassword}
                label={loadingResetPassword ? "Chargement..." : "Réinitialiser le mot de passe"}
                variant={loadingResetPassword ? "pending" : "secondary"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;