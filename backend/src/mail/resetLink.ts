import { User } from "../entities/User";
import { sendEmail } from "./sendMail";

export async function resetLink(user: User, token: string) {
  const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
  return sendEmail({
    toEmail: user.email,
    toName: user.firstName,
    subject: "Réinitialisation de votre mot de passe",
    text: `Bonjour ${user.firstName},

Il semble que vous ayez demandé une réinitialisation de mot de passe.

Suivez le lien ci-dessous et saisissez un nouveau mot de passe :
${resetLink}

Cordialement,
L'équipe Hopin'Go`,

    html: `<p>Bonjour ${user.firstName},</p>

<p>Il semble que vous ayez demandé une réinitialisation de mot de passe.</p>

<p>Suivez le lien ci-dessous et saisissez un nouveau mot de passe :</p>
<a href="${resetLink}">${resetLink}</a>

<p>Cordialement,<br/>
L'équipe Hopin'Go</p>`,
  });
}