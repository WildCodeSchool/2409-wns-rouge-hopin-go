import { useMutation, useQuery } from "@apollo/client";
import { queryWhoAmI } from "../api/WhoAmI";
import { Eye, EyeOff, LoaderCircle, X } from "lucide-react";
import { formatErrors } from "../utils/formatErrors";
import { useEffect, useState } from "react";
import {
  validateEmail as validateEmailUtils,
  validatePassword as validatePasswordUtils,
} from "../utils/validators";
import Button from "../components/Button";
import { mutationUpdateMyAccount } from "../api/UpdateMyAccount";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DeleteMyAccount } from "../api/DeleteMyAccount";
import Modal from "../components/Modal";
import { useModal } from "../hooks/useModal";

const MyAccount = () => {
  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;
  const navigate = useNavigate();

  const { isOpen, isVisible, toggleModal, closeModal } = useModal();

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
  // suppression du compte
  const [doDelete, { loading: deleting }] = useMutation(DeleteMyAccount, {
    refetchQueries: [queryWhoAmI],
  });

  async function handleDelete() {
    await doDelete();
    toast.info("Compte supprimé.");
    navigate("/", { replace: true });
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center pt-20 px-4">
      <div className="flex flex-col items-center rounded-xl p-8 shadow-lg bg-primary text-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8">Mon Compte</h1>

        {me && (
          <form
            className="flex flex-col w-full gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2 className="text-xl font-semibold">
              Bienvenue {me.firstName} !
            </h2>
            <p>
              Vous pouvez mettre à jour votre adresse email et votre mot de
              passe ci-dessous.
            </p>

            <label className="block mt-4" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email} // ← contrôlé
              onChange={(e) => setEmail(e.target.value)}
              className={`border p-2 rounded-md w-full text-black ${
                error.email?.length
                  ? "border-error bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {error.email?.length ? (
              <p className="text-full self-start text-sm bg-gray-50 px-2 py-1 rounded-lg w-fit mt-2">
                {formatErrors(error.email)}
              </p>
            ) : null}

            <label className="block mt-4" htmlFor="password">
              Mot de passe
            </label>
            <div className="flex">
              <input
                type={revealPassword ? "text" : "password"}
                id="password"
                className={`shadow-sm border textDark text-sm text-black rounded-lg focus:outline-none block w-full p-2.5 ${
                  error.password?.length
                    ? "border-error bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                value={password} // ← contrôlé
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe (laissez vide pour ne pas changer)"
                aria-describedby={error.password ? "password-error" : undefined}
              />
              <Button
            variant="secondary"
            type="button"
            className="!-ml-[2.40rem] rounded-lg !m-1"
            onClick={() => setRevealPassword(!revealPassword)}
            aria-label={
              revealPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
            icon={revealPassword ? Eye : EyeOff}
          />
            </div>
            {error.password?.length ? (
              <p id="password-error" className="text-full self-start text-sm bg-gray-50 px-2 py-1 rounded-lg w-fit">
                {formatErrors(error.password)}
              </p>
            ) : null}

            {error.general && (
              <p role="alert" className="text-full self-start text-sm bg-gray-50 px-2 py-1 rounded-lg w-fit mt-2">
                {formatErrors(error.general)}
              </p>
            )}

            <Button
              type="submit"
              className="w-fit self-end mt-4"
              variant={loading ? "pending" : "secondary"}
              isHoverBgColor
              icon={loading ? LoaderCircle : undefined}
              iconRotateAnimation={loading}
              label={loading ? "Mise à jour..." : "Mettre à jour"}
              disabled={loading}
              onClick={handleSubmit} // ← on appelle vraiment la mutation
            />
            <div className="border-t border-gray-200 mt-4" />
            <div className="flex flex-col gap-4  mt-4 bg-gray-50 text-black rounded-md p-4">
              <p>
                Vous pouvez également supprimer votre compte. Cette action est
                irréversible.
              </p>
              <Button
                type="submit"
                className="w-fit self-end"
                icon={loading ? LoaderCircle : undefined}
                iconRotateAnimation={loading}
                isHoverBgColor
                label={deleting ? "Suppression..." : "Supprimer mon compte"}
                disabled={loading}
                onClick={() => toggleModal("deleteAccountModal")} // ← on appelle vraiment la mutation
              />
            </div>
          </form>
        )}

        <Modal
          id="deleteAccountModal"
          isOpen={isOpen("deleteAccountModal")}
          isVisible={isVisible("deleteAccountModal")}
          onClose={() => closeModal("deleteAccountModal")}
        >
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <header className="w-full flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Confirmation de la suppression
              </h2>
              <Button
                icon={X}
                iconColor="text-primary"
                hoverIconColor="!text-white"
                iconSize={26}
                type="button"
                variant="full"
                isBgTransparent
                onClick={() => closeModal("deleteAccountModal")}
                className="group hover:!bg-primaryHover"
              />
            </header>
            <main className="relative w-full h-full flex flex-col gap-4 justify-between">
              <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
              <p className="text-sm text-gray-500">
                Cette action est irréversible et supprimera toutes vos données
                personnelles.
              </p>
              <Button
                type="button"
                variant="full"
                isHoverBgColor
                icon={loading ? LoaderCircle : undefined}
                iconRotateAnimation={loading}
                label={deleting ? "Suppression..." : "Supprimer mon compte"}
                disabled={loading}
                onClick={handleDelete}
                className=" w-fit self-end"
              />
            </main>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MyAccount;
