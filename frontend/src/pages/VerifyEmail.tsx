import { useMutation } from "@apollo/client";
import { mutationVerifyEmail } from "../api/VerifyEmail";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Verify = () => {
  const navigate = useNavigate();
  const [verifyEmail, { data, loading, error }] = useMutation(mutationVerifyEmail);

  const [params] = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail({ variables: { token } });
    }
  }, [token, verifyEmail]);

  const result = data?.verifyEmail;

  useEffect(() => {
    if (loading) return;

    if (error) {
      toast.error(`Erreur : ${error.message}`);
      return;
    }

    if (!result) return;
    if (result.success) {
      toast.success(`Email vérifié — Redirection en cours...`);
      setTimeout(() => navigate("/auth/signin"), 3000);
    } else {
      toast.error("Lien invalide ou expiré. Veuillez recommencer votre inscription.");
    }
  }, [data, loading, error, navigate]);

  if (loading) return <p>Vérification en cours...</p>;

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="bg-primary flex h-1/3 w-2/3 flex-col items-center justify-center rounded-xl text-white shadow-lg">
        {result?.success ? (
          <>
            <h1 className="text-center text-xl font-semibold">Votre email est vérifié.</h1>
            <p className="mt-2 text-center">
              Vous allez être redirigé automatiquement vers la page de connexion.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-center text-xl font-semibold">Lien invalide ou expiré.</h1>
            <p className="mt-2 text-center">Veuillez recommencer votre inscription.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
