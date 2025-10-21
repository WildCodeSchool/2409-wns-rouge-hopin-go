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

  useEffect(() => {
    if (loading) return;

    if (error) {
      toast.error(`Erreur : ${error.message}`);
      return;
    }

    const result = data?.verifyEmail;
    if (!result) return;
    if (result.success) {
      toast.success(`${result.message} — Redirection en cours...`);
      setTimeout(() => navigate("/auth/signin"), 3000);
    } else {
      toast.error("Lien invalide ou expiré. Veuillez recommencer votre inscription.");
    }
  }, [data, loading, error, navigate]);

  if (loading) return <p>Vérification en cours...</p>;

  return null;
};

export default Verify;
