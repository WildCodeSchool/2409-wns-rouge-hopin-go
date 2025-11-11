import { useApolloClient, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Button from "./Button";
import { queryRide } from "../api/Ride";
import useWindowSize from "../utils/useWindowSize";
import { queryWhoAmI } from "../api/WhoAmI";
import { mutationCreatePassengerRide } from "../api/CreatePassengerRide";
import { VariantType } from "../types/variantTypes";
import { toast } from "react-toastify";
import { querySearchRides } from "../api/SearchRides";
import useRideOptional from "../context/Rides/useRideOptional";

export default function RegisterButton({
  rideId: rideIdProp,
  size,
  variant,
  icon,
}: {
  rideId?: string;
  size: "small" | "large";
  variant?: VariantType;
  icon?: React.ElementType;
}) {
  const rideContext = useRideOptional();
  const client = useApolloClient();

  const [getRide] = useLazyQuery(queryRide);
  const [doCreatePassengerRide, { loading }] = useMutation(mutationCreatePassengerRide);

  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;
  const isLoggedIn = me ? true : false;
  const { isSm, isMd } = useWindowSize();

  // selon le variant reçu en prop, on sait si l'utilisateur est inscrit ou pas
  // To Do : Changer d'icone selon le variant ?
  // Si variant === validation : "Annuler/Gérer l'inscription" au lieu de "Réserver" et changer le comportement du bouton ? => handleCancelRegister
  const hasRegistered = variant === "pending" || variant === "validation" ? true : false;

  const rideId = rideIdProp ? rideIdProp : rideContext?.id;
  if (!rideId) {
    console.error("No rideId provided or available in context.");
    return null;
  }

  const handleRegister = async () => {
    // implémenter une modale de confirmation ???
    try {
      // Normalement un user non connecté ne peut pas déclencher cette fonction mais on vérifie quand même
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

      // On pourrait mettre une erreur personnalisée si l'utilisateur essaie de réserver son propre trajet mais c'est un cas qui ne devrait pas arriver

      // création d'un tuple passenger_ride s'il reste de la place
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
        await client.refetchQueries({
          include: [querySearchRides],
        });
      } else {
        toast.error("Ce trajet est complet.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Une erreur est survenue lors de l'inscription.");
    }
  };

  const chooseLabel = () => {
    if (loading) {
      return "Inscription en cours ...";
    }
    switch (variant) {
      case "primary":
        return isLoggedIn ? "Réserver" : "Connectez-vous pour réserver";
      case "validation":
        return "Inscription validée";
      case "pending":
        return "En attente de validation";
      case "cancel":
        return "Trajet annulé";
      case "refused":
        return "Inscription refusée";
      case "full":
        return "Trajet complet";
      default:
        return "";
    }
  };

  {
    return size === "small" ? (
      <Button
        isDisabled={(variant !== "primary" && variant !== "secondary") || loading}
        iconRotate={variant === "primary" || variant === "secondary"}
        variant={variant}
        icon={icon}
        iconSize={isMd ? 32 : isSm ? 32 : 24}
        isHoverBgColor={variant === "primary" || variant === "secondary"}
        onClick={isLoggedIn && !hasRegistered ? handleRegister : undefined}
        isLink={isLoggedIn ? false : true}
        to="/auth/signin"
        className="z-10 my-2 -ml-2 !rounded-full shadow-lg sm:-ml-6"
      />
    ) : (
      <Button
        isDisabled={(variant !== "primary" && variant !== "secondary") || loading}
        variant={variant}
        icon={icon}
        iconSize={isMd ? 32 : isSm ? 32 : 24}
        label={chooseLabel()}
        onClick={isLoggedIn && !hasRegistered ? handleRegister : undefined}
        isLink={isLoggedIn ? false : true}
        to="/auth/signin"
        className="w-fit"
      />
    );
  }
}
