/**
 * Réduit (décime) une polyline encodée en précision 5 pour une URL d'image Mapbox Static.
 *
 * Objectif :
 * - Les URLs Static Map peuvent devenir trop longues (erreur 413).
 * - On retire des points intermédiaires de la polyline jusqu'à ce que l'URL finale
 *   générée par `makeUrl` respecte une longueur maximale (maxLen).
 *
 * Stratégie :
 * - On essaie des "pas" successifs (1, 2, 3, ...), en ne gardant qu’1 point sur N.
 * - On garantit que le premier et le dernier point restent présents (continuité du tracé).
 * - À chaque itération, on réencode en polyline(5), on construit l’URL via `makeUrl`,
 *   et on vérifie sa longueur.
 *
 * @param encoded  Polyline encodée (precision 5, format Mapbox/Google).
 * @param makeUrl  Fonction qui, à partir d’une polyline encodée, retourne l’URL Static Map complète.
 *                 (Cette fonction est utilisée pour "tester" la longueur de l’URL.)
 * @param maxLen   Longueur max autorisée pour l’URL (par défaut 7500, valeur prudente).
 * @returns        Une polyline(5) potentiellement raccourcie, suffisamment courte pour l’URL.
 */
import polyline from "@mapbox/polyline";

export function shrinkPolyline5ForStatic(
  encoded: string,
  makeUrl: (enc: string) => string,
  maxLen = 7500
): string {
  // Décodage : [[lat, lng], ...]
  const coords = polyline.decode(encoded, 5);
  // Si déjà trop court (2 points ou moins), inutile de décimer
  if (coords.length <= 2) return encoded;

  // On teste des décimations progressives : 1 point sur 2, 1 sur 3, ..., 1 sur 20
  // (20 est un plafond raisonnable : au-delà, la ligne perd trop de précision)
  for (let step = 1; step <= 20; step++) {
    // Pour step=1, on garde tout (permet de vérifier si l’URL passe "as-is")
    // Pour step>1, on garde 1 point sur `step`
    const filtered = step === 1 ? coords : coords.filter((_, i) => i % step === 0);

    // On force la présence du premier point si le filtrage l’a supprimé
    if (filtered[0] !== coords[0]) filtered.unshift(coords[0]);

    // On force la présence du dernier point si le filtrage l’a supprimé
    if (filtered[filtered.length - 1] !== coords[coords.length - 1]) {
      filtered.push(coords[coords.length - 1]);
    }

    // Ré-encodage en polyline précision 5
    const enc = polyline.encode(filtered, 5);

    // On laisse l’appelant construire l’URL finale, puis on mesure sa longueur
    const url = makeUrl(enc);

    // Si l’URL tient sous la limite (ou si l’on est quasiment réduit à 2 points), on s’arrête ici
    if (url.length <= maxLen || filtered.length <= 2) return enc;
  }

  // Cas extrême : si aucune étape n’a suffi, on renvoie une polyline réduite au strict minimum
  // (ligne droite du 1er au dernier point)
  return polyline.encode([coords[0], coords[coords.length - 1]], 5);
}
