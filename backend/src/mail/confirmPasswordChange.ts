import { User } from "../entities/User";
import { sendEmail } from "./sendMail";

export async function confirmPasswordChange(user: User) {
  return sendEmail({
    toEmail: user.email,
    toName: user.firstName,
    subject: "Votre mot de passe",
    text: `Bonjour ${user.firstName},

Votre mot de passe a été modifié avec succès.

Cordialement,
L'équipe Hopin'Go`,

    html: `<p>Bonjour ${user.firstName},</p>

<p>Votre mot de passe a été modifié avec succès.</p>

<p>Cordialement,<br/>
L'équipe Hopin'Go</p>`,
  });
}