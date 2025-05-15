import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Button from "./Button";
import { queryRide } from "../api/Ride";
import useWindowSize from "../utils/useWindowSize";
import { queryWhoAmI } from "../api/WhoAmI";
import { mutationCreatePassengerRide } from "../api/CreatePassengerRide";
import { VariantType } from "../types/variantTypes";

export default function RegisterButton({
  rideId,
  size,
  variant,
  icon,
}: {
  rideId: string;
  size: "small" | "large";
  variant?: VariantType;
  icon?: React.ElementType;
}) {
  const [getRide] = useLazyQuery(queryRide);
  const [doCreatePassengerRide] = useMutation(mutationCreatePassengerRide);

  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;
  console.log("me, rideId, size", me, rideId, size);
  const { isSm, isMd } = useWindowSize();

  // TO DO : useEffect pour voir si l'utilisateur est inscrit sur ce trajet
  // Si oui, on affiche un bouton "Annuler l'inscription" au lieu de "Réserver" et on change le comportement du bouton

  // Attention, selon l'endroit où ce composant est utilisé, on voudra afficher soit un petit bouton avec juste l'icone de ticket , soit un gros bouton avec aussi le texte "Réserver"
  // Passer un prop pour savoir quelle version afficher ??
  // La taille du bouton pourrait aussi dépendre de la résolution de l'écran !

  const handleRegister = async () => {
    console.log("handleRegister", rideId);
    // modale de confirmation ???
    // que se passe-t-il si l'utilisateur n'est pas connecté ?

    // incrémenter le nombre de passagers actuellement 'involved' dans la réservation

    // générer un toast selon le succès ou l'échec de la requête

    try {
      // On fetch ride pour vérifier que le nombre de passagers n'a pas changé entre temps et comparer
      const { data } = await getRide({
        variables: {
          id: rideId,
        },
      });
      const nbPassenger = data?.ride?.nb_passenger;
      const maxPassenger = data?.ride?.max_passenger;

      console.log(
        "data, nbPassenger, maxPassenger",
        data,
        nbPassenger,
        maxPassenger
      );

      // création d'un tuple passenger_ride
      if (
        typeof nbPassenger === "number" &&
        typeof maxPassenger === "number" &&
        me &&
        nbPassenger < maxPassenger
      )
        await doCreatePassengerRide({
          variables: {
            data: {
              ride_id: rideId,
              user_id: me.id,
            },
          },
        });
      // toast de succès
      // useMutation(incrementPassengerRide, {
      else {
        console.error("Le nombre maximum de passagers a été atteint.");
        // Afficher un toast d'erreur
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // Afficher un toast d'erreur
    }
  };

  {
    return size === "small" ? (
      <Button
        isDisabled={variant !== "primary" && variant !== "secondary"}
        iconRotate={variant === "primary" || variant === "secondary"}
        variant={variant}
        icon={icon}
        iconSize={isMd ? 32 : isSm ? 32 : 24}
        isHoverBgColor={variant === "primary" || variant === "secondary"}
        onClick={handleRegister}
        className="!rounded-full shadow-lg -ml-2 sm:-ml-6 my-2 z-10"
      />
    ) : (
      <Button
        variant="primary"
        icon={icon}
        iconSize={isMd ? 32 : isSm ? 32 : 24}
        label={"Réserver"}
        onClick={handleRegister}
        className="w-full"
      />
    );
  }
}
