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

    const isSuccess =
      result.success &&
      ["Email verified successfully!", "Already verified"].includes(result.message);

    if (isSuccess) {
      toast.success(
        `${result.message === "Already verified" ? "Email déjà vérifié" : "Email vérifié"} — Redirection en cours...`
      );
      setTimeout(() => navigate("/auth/signin"), 3000);
    } else {
      toast.error("Lien invalide ou expiré. Veuillez recommencer votre inscription.");
    }
  }, [data, loading, error, navigate]);

  if (loading) return <p>Vérification en cours...</p>;

  const messages: Record<string, { title: string; text: string }> = {
    "Email verified successfully!": {
      title: "Votre email est vérifié.",
      text: "Vous allez être redirigé automatiquement vers la page de connexion.",
    },
    "Already verified": {
      title: "Votre email a déjà été vérifié.",
      text: "Vous allez être redirigé automatiquement vers la page de connexion.",
    },
    default: {
      title: "Lien invalide ou expiré.",
      text: "Veuillez recommencer votre inscription.",
    },
  };
  const message = messages[result?.message || "default"];

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="bg-primary flex h-1/3 w-2/3 flex-col items-center justify-center rounded-xl text-white shadow-lg">
        <>
          <h1 className="text-center text-xl font-semibold">{message.title}</h1>
          <p className="mt-2 text-center">{message.text}</p>
        </>
      </div>
    </div>
  );
};

export default Verify;
