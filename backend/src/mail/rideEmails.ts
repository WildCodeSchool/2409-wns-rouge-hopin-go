import { Ride } from "../entities/Ride";
import { User } from "../entities/User";
import { sendEmail } from "./sendMail";

export async function notifyDriverNewPassenger(
  driver: User,
  passenger: User,
  ride: Ride
) {
  return sendEmail({
    toEmail: driver.email,
    toName: driver.firstName,
    subject: "Nouvelle demande de réservation",
    text: `Bonjour ${driver.firstName},

Vous avez une nouvelle demande de réservation pour votre trajet le ${ride.departure_at.toLocaleString()} de ${
      ride.departure_city
    } à ${ride.arrival_city}.

Passager : ${passenger.firstName} ${passenger.lastName}

Veuillez vous connecter à votre compte pour accepter ou refuser cette demande.

Cordialement,
L'équipe Hopin'Go`,

    html: `<p>Bonjour ${driver.firstName},</p>

<p>Vous avez une nouvelle demande de réservation pour votre trajet le <strong>${ride.departure_at.toLocaleString()}</strong> de <strong>${
      ride.departure_city
    }</strong> à <strong>${ride.arrival_city}</strong>.</p>

<p><strong>Passager :</strong> ${passenger.firstName} ${passenger.lastName}</p>

<p>Veuillez vous connecter à votre compte pour accepter ou refuser cette demande</p> <a href="http://http://http://localhost:8080/auth/signin">ici</a>.

<p>Cordialement,<br/>
L'équipe Hopin'Go</p>`,
  });
}
