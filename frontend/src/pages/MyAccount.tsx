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

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [error, setError] = useState<Record<string, string[]>>({});
  const [deletePassword, setDeletePassword] = useState("");
const [revealDeletePassword, setRevealDeletePassword] = useState(false);
const [deleteError, setDeleteError] = useState<string | null>(null);


  useEffect(() => {
    if (me?.email) setEmail(me.email);
  }, [me?.email]);

  const validate = (): boolean => {
  const emailErrors = email ? validateEmailUtils(email) : [];

  const wantsPasswordChange = !!newPassword;

  const currentPasswordErrors = wantsPasswordChange
    ? (currentPassword ? [] : ["Le mot de passe actuel est requis"])
    : [];

  const newPasswordErrors = wantsPasswordChange
    ? validatePasswordUtils(newPassword)
    : [];

  setError({
    email: emailErrors,
    currentPassword: currentPasswordErrors,
    newPassword: newPasswordErrors,
  });

  return (
    emailErrors.length === 0 &&
    currentPasswordErrors.length === 0 &&
    newPasswordErrors.length === 0
  );
};

  const handleSubmit = async () => {
  if (!validate()) return;

  const wantsPasswordChange = !!newPassword;
  const data: Record<string, string> = {};

  if (email && email !== me?.email) data.email = email;
  
  if (wantsPasswordChange) {
    data.currentPassword = currentPassword;
    data.password = newPassword;
  }

  if (Object.keys(data).length === 0) {
    setError({ general: ["Aucune modification à enregistrer."] });
    setTimeout(() => setError({}), 3000);
    return;
  }

  try {
    await doUpdate({ variables: { data } });
    toast.success("Compte mis à jour avec succès !");
    if (wantsPasswordChange) {
      setCurrentPassword("");
      setNewPassword("");
    }
    setError({});
  } catch (e: unknown) {
    toast.error("Le mot de passe actuel est requis pour changer le mot de passe.");    
  }
};

 
  const [doDelete, { loading: deleting }] = useMutation(DeleteMyAccount, {
    refetchQueries: [queryWhoAmI],
  });

  async function handleDelete() {
  setDeleteError(null);
  try {
    await doDelete({ variables: { currentPassword: deletePassword } });
    toast.info("Compte supprimé.");
    navigate("/", { replace: true });
  } catch (e: unknown) {
    console.error(e);
  }
}

function closeDeleteModalSafe() {
  setDeletePassword("");
  setDeleteError(null);
  closeModal("deleteAccountModal");
}

  return (
    <div className="h-screen md:h-[calc(100vh-4rem)] flex items-center justify-center md:pt-20 md:px-4">
      <div className="flex flex-col items-center md:rounded-xl p-8 shadow-lg bg-primary text-white h-full md:h-fit w-full md:max-w-md">
        <h1 className="text-2xl font-bold mb-8">Mon Compte</h1>

        {me && (
          <form
            className="flex flex-col h-full w-full gap-2 max-w-md"
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
              value={email}
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


            <label className="block mt-4" htmlFor="currentPassword">
              Mot de passe actuel
            </label>
            <p className=" text-xs">Entrez votre mot de passe actuel avant de pouvoir le modifier.</p>
            <div className="flex">
              <input
                type={revealPassword ? "text" : "password"}
                id="currentPassword"
                className={`shadow-sm border  text-sm text-black rounded-lg focus:outline-none block w-full p-2.5 ${
                  error.currentPassword?.length
                    ? "border-error bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Entrez votre mot de passe actuel"
                aria-describedby={error.currentPassword ? "currentPassword-error" : undefined}
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
            <label className="block mt-4" htmlFor="newPassword">
              Nouveau mot de passe
            </label>
            <div className="flex">
              <input
                disabled={!currentPassword}
                type={revealPassword ? "text" : "password"}
                id="newPassword"
                className={`shadow-sm border text-black text-sm rounded-lg focus:outline-none block w-full p-2.5 ${
                  !currentPassword ? "opacity-50 cursor-not-allowed" : ""
                } ${error.newPassword?.length ? "border-error bg-red-50" : "border-gray-300 bg-white"}`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mot de passe (laissez vide pour ne pas changer)"
                aria-describedby={error.newPassword ? "newPassword-error" : undefined}
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
            {error.newPassword?.length ? (
              <p id="newPassword-error" className="text-full self-start text-sm bg-gray-50 px-2 py-1 rounded-lg w-fit">
                {formatErrors(error.newPassword)}
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
              onClick={handleSubmit}
            />
            <div className="border-t border-gray-200 mt-4" />
            <div className="flex flex-col gap-4 mt-4 bg-gray-50 text-black rounded-md p-4">
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
                onClick={() => toggleModal("deleteAccountModal")}
              />
            </div>
          </form>
        )}
        <Modal
          id="deleteAccountModal"
          isOpen={isOpen("deleteAccountModal")}
          isVisible={isVisible("deleteAccountModal")}
          onClose={closeDeleteModalSafe}
        >
          <div className="p-6 bg-white sm:rounded-xl md:shadow-lg w-screen md:w-fit sm:max-w-md">
            <header className="w-full flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Confirmation de la suppression</h2>
              <Button
                icon={X}
                iconColor="text-primary"
                hoverIconColor="!text-white"
                iconSize={26}
                type="button"
                variant="full"
                isBgTransparent
                onClick={closeDeleteModalSafe}
                className="group hover:!bg-primaryHover"
              />
            </header>
            <main className="relative w-full h-full flex flex-col gap-4 justify-between">
              <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
              <p className="text-sm text-gray-500">
                Cette action est irréversible et supprimera toutes vos données personnelles.
              </p>
              <div>
                <label className="block mb-1 text-sm" htmlFor="deletePassword">
                  Mot de passe actuel
                </label>
                <div className="flex">
                  <input
                    type={revealDeletePassword ? "text" : "password"}
                    id="deletePassword"
                    className={`shadow-sm border text-sm text-black rounded-lg focus:outline-none block w-full p-2.5 ${
                      deleteError ? "border-error bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      if (deleteError) setDeleteError(null);
                    }}
                    placeholder="Entrez votre mot de passe actuel"
                    aria-describedby={deleteError ? "deletePassword-error" : undefined}
                  />
                  <Button
                    variant="secondary"
                    type="button"
                    className="!-ml-[2.40rem] rounded-lg !m-1"
                    onClick={() => setRevealDeletePassword(!revealDeletePassword)}
                    aria-label={revealDeletePassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    icon={revealDeletePassword ? Eye : EyeOff}
                  />
                </div>
                {deleteError ? (
                  <p id="deletePassword-error" className="text-full self-start text-sm bg-gray-50 px-2 py-1 rounded-lg w-fit mt-2">
                    {deleteError}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant={!deleting && deletePassword.length < 8 ? "cancel" : "full"}
                isHoverBgColor
                icon={deleting ? LoaderCircle : undefined}
                iconRotateAnimation={deleting}
                label={deleting ? "Suppression..." : "Supprimer mon compte"}
                disabled={deleting || deletePassword.length < 8}
                onClick={handleDelete}
                className={`${!deleting && deletePassword.length < 8 ? "!cursor-not-allowed" : ""} w-fit self-end`}
              />
            </main>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default MyAccount;
