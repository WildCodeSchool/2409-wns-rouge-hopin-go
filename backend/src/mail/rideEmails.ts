import { Ride } from "../entities/Ride";
import { User } from "../entities/User";
import { sendEmail } from "./sendMail";

// Notification au conducteur d'un nouveau passager à valider
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

<p>Veuillez vous connecter à votre compte pour accepter ou refuser cette demande<a href="http://localhost:8080/auth/signin"> ici</a>.</p> 

<p>Cordialement,<br/>
L'équipe Hopin'Go</p>`,
  });
}

// Notification au passager de la validation de son trajet
export async function notifyUserRideValidation(passenger: User, ride: Ride) {
  return sendEmail({
    toEmail: passenger.email,
    toName: passenger.firstName,
    subject: "Validation de votre trajet",
    text: `Bonjour ${passenger.firstName},

Votre trajet de ${ride.departure_city} à ${
      ride.arrival_city
    } le ${ride.departure_at.toLocaleString()} a été validé.

Cordialement,
L'équipe Hopin'Go`,

    html: `<p>Bonjour ${passenger.firstName},</p>

<p>Votre trajet de <strong>${ride.departure_city}</strong> à <strong>${ride.arrival_city}</strong> a été validé.</p>

<p>Cordialement,<br/>
L'équipe Hopin'Go</p>`,
  });
}

// Notification au passager de l'annulation de son trajet
export async function notifyUserRideRefused(passenger: User, ride: Ride) {
  return sendEmail({
    toEmail: passenger.email,
    toName: passenger.firstName,
    subject: "Annulation de votre trajet",
    text: `Bonjour ${passenger.firstName},

Votre trajet de ${ride.departure_city} à ${
      ride.arrival_city
    } le ${ride.departure_at.toLocaleString()} a été annulé.

Cordialement,
L'équipe Hopin'Go`,

    html: `<p>Bonjour ${passenger.firstName},</p>

<p>Votre trajet de <strong>${ride.departure_city}</strong> à <strong>${ride.arrival_city}</strong> a été annulé.</p>

<p>Cordialement,<br/>
L'équipe Hopin'Go</p>`,
  });
}
