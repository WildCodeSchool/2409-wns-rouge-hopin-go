import { User } from "../entities/User";
import { sendEmail } from "./sendMail";

// Verify email
export async function verifyUserEmail(user: User, token: string) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;
  return sendEmail({
    toEmail: user.email,
    toName: user.firstName,
    subject: "Confirmation de votre adresse email",
    text: `Bonjour ${user.firstName} et bienvenue sur Hopin'Go,

Il vous reste une dernière étape avant de pouvoir profiter de tous les services d'Hopin'Go.

Activer votre compte Hopin'Go en cliquant ici :
${verificationLink}

Cordialement,
L'équipe Hopin'Go`,

    html: `<p>Bonjour ${user.firstName},</p>

<p>Il vous reste une dernière étape avant de pouvoir profiter de tous les services d'Hopin'Go.</p>

<p>Activer votre compte Hopin'Go en cliquant ici :</p>
<a href="${verificationLink}">${verificationLink}</a>

<p>Cordialement,<br/>
L'équipe Hopin'Go</p>`,
  });
}
