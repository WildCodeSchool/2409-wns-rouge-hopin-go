import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Button from "./Button";
import { queryRide } from "../api/Ride";
import useWindowSize from "../utils/useWindowSize";
import { queryWhoAmI } from "../api/WhoAmI";
import { mutationCreatePassengerRide } from "../api/CreatePassengerRide";
import { VariantType } from "../types/variantTypes";
import { toast } from "react-toastify";
// import { useEffect, useState } from "react";
// import { queryPassengerRide } from "../api/PassengerRide";

export default function RegisterButton({ rideId, size, variant, icon }: { rideId: string, size: "small" | "large", variant: VariantType, icon?: React.ElementType }) {

    // tests
    // variant = "pending"


    const [getRide] = useLazyQuery(queryRide);
    // const [getPassengerRide] = useLazyQuery(queryPassengerRide);
    const [doCreatePassengerRide] = useMutation(mutationCreatePassengerRide);

    const { data: whoAmIData } = useQuery(queryWhoAmI);
    const me = whoAmIData?.whoami;
    const isLoggedIn = me ? true : false;

    console.log("me, rideId, size", me, rideId, size);
    const { isSm, isMd } = useWindowSize();

    // selon le variant reçu en prop, on sait si l'utilisateur est inscrit ou pas
    // TO DO : créer un variant "refusé" pour le cas où le conducteur refuse l'inscription
    // Quel icone et quel label utiliser pour chaque variant ?
    // "Annuler/Gérer l'inscription" au lieu de "Réserver" et changer le comportement du bouton ?
    const hasRegistered = variant === "pending" || variant === "validation" ? true : false;
    // console.log("hasRegistered", hasRegistered);


    // Attention, selon l'endroit où ce composant est utilisé, on voudra afficher soit un petit bouton avec juste l'icone de ticket , soit un gros bouton avec aussi le texte "Réserver"
    // Passer un prop pour savoir quelle version afficher ??
    // La taille du bouton pourrait aussi dépendre de la résolution de l'écran !

    const handleRegister = async () => {
        // console.log("handleRegister", rideId);
        // modale de confirmation ???

        // nb_passenger sera incrémenté seulement quand driver valide un passager

        try {
            // Normalement un user non connecté ne peut pas déclencher cette fonction
            if (!me) {
                console.error("Vous devez être connecté pour réserver un trajet.");
                return;
            }
            // On fetch ride pour vérifier que le le trajet existe toujours et que le nombre max de passagers n'a pas été atteint entre temps
            const { data } = await getRide({
                variables: {
                    id: rideId,
                },
            });
            const nbPassenger = data?.ride?.nb_passenger;
            const maxPassenger = data?.ride?.max_passenger;

            console.log("data, nbPassenger, maxPassenger", data, nbPassenger, maxPassenger);

            // création d'un tuple passenger_ride
            if (
                typeof nbPassenger === "number" &&
                typeof maxPassenger === "number" &&
                nbPassenger < maxPassenger
            ) {
                await doCreatePassengerRide({
                    variables: {
                        data: {
                            ride_id: rideId,
                            user_id: me.id,
                        },
                    },
                });
                // TO DO : ajouter un bouton "Voir mes trajets" dans le toast
                toast.success("Demande de réservation envoyée avec succès !");
                // Normalement la variant va changer automatiquement à "pending" donc hasRegistered devient true
            } else {
                toast.error("Ce trajet est complet.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("Une erreur est survenue lors de l'inscription.");
        }
    };

    const chooseLabel = () => {
        switch (variant) {
            case "primary":
                return isLoggedIn ? "Réserver" : "Connectez-vous pour réserver";
            case "validation":
                return "Inscription validée";
            case "pending":
                return "En attente de validation";
            case "cancel":
                return "Trajet annulé";
            // case "refused":
            //     return "Inscription refusée";
            case "error":
                return "Trajet complet";
            default:
                return "";
        }
    }

    {
        return size === "small" ? (
            <Button
                isDisabled={variant !== "primary" && variant !== "secondary"}
                iconRotate={variant === "primary" || variant === "secondary"}
                variant={variant}
                icon={icon}
                iconSize={isMd ? 32 : isSm ? 32 : 24}
                isHoverBgColor={variant === "primary" || variant === "secondary"}
                onClick={isLoggedIn && !hasRegistered ? handleRegister : undefined}
                isLink={isLoggedIn ? false : true}
                to="signin"
                className="!rounded-full shadow-lg -ml-2 sm:-ml-6 my-2 z-10"
            />
        ) : (
            <Button
                variant={variant}
                icon={icon}
                iconSize={isMd ? 32 : isSm ? 32 : 24}
                label={chooseLabel()}
                onClick={isLoggedIn && !hasRegistered ? handleRegister : undefined}
                isLink={isLoggedIn ? false : true}
                to="signin"
                className="w-full"
            />
        )
    }
}