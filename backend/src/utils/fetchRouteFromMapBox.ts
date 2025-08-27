// services/mapbox.ts
import fetch from "node-fetch";

/**
 * Service d’appel à Mapbox Directions (profil "driving") côté serveur.
 *
 * Points clés :
 * - Le token est lu depuis l’ENV (MAPBOX_DIRECTIONS_TOKEN) et NE DOIT PAS être exposé au front.
 * - On demande une géométrie "polyline" avec "overview=simplified" pour obtenir une polyligne courte
 *   (idéale pour l’API Mapbox Static et pour stocker en base).
 * - On renvoie : distance (km), durée (minutes entières), polyline (précision 5).
 *
 * Remarques token :
 * - Côté serveur, tu peux utiliser un token secret `sk.*` (recommandé) ou un token public `pk.*`.
 * - Deux modes de passage possibles :
 *   1) En paramètre de query `?access_token=...` (utilisé ici, simple et efficace côté serveur).
 *   2) En en-tête HTTP `Authorization: Bearer <TOKEN>` (voir variante commentée plus bas).
 *
 * Erreurs :
 * - On lit toujours le `body` (texte) même en cas d’erreur HTTP pour avoir le détail Mapbox,
 *   et on l’inclut dans l’exception (utile au debug).
 */

const TOKEN = process.env.MAPBOX_DIRECTIONS_TOKEN;
if (!TOKEN) throw new Error("Missing MAPBOX_DIRECTIONS_TOKEN");

type MapboxRoute = {
  distanceKm: number;
  durationMin: number;
  polyline5: string; // Encodage polyline précision 5
};

export async function fetchRouteFromMapbox(
  depLng: number,
  depLat: number,
  arrLng: number,
  arrLat: number
): Promise<MapboxRoute> {
  // URL Directions :
  // - geometries=polyline → retourne une polyline (précision 5 par défaut)
  // - overview=simplified → moins de points → URL Static + légère, stockage plus compact
  // - alternatives=false → une seule route
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${depLng},${depLat};${arrLng},${arrLat}` +
    `?geometries=polyline&overview=simplified&alternatives=false` +
    // Ici on passe le token en query (OK côté serveur)
    `&access_token=${encodeURIComponent(TOKEN ?? "")}`;

  // Appel HTTP (node-fetch). NB: en Node >= 18, tu peux utiliser fetch natif.
  const res = await fetch(url);

  // Toujours lire le body texte pour remonter un message d’erreur utile si !ok
  const body = await res.text();
  if (!res.ok) {
    // Exemple d’erreurs :
    //  - 401: "Not Authorized - Invalid Token"
    //  - 403: "Forbidden - URL restricted" (si restrictions de domaine mal configurées)
    throw new Error(`Mapbox HTTP ${res.status} – ${body}`);
  }

  // Parse JSON après avoir validé le statut
  const json = JSON.parse(body);
  const route = json?.routes?.[0];
  if (!route) throw new Error("No route from Mapbox");

  // Normalisation du résultat
  return {
    distanceKm: route.distance / 1000, // mètres → kilomètres
    durationMin: Math.ceil(route.duration / 60), // secondes → minutes entières
    polyline5: route.geometry, // déjà encodée (precision 5)
  };
}

/* ──────────────────────────────────────────────────────────────────────────────
   Variante : en-tête Authorization (Bearer) au lieu de ?access_token=...
   À utiliser si tu préfères ne PAS faire apparaître le token dans l’URL.

export async function fetchRouteFromMapboxAuthHeader(
  depLng: number,
  depLat: number,
  arrLng: number,
  arrLat: number
): Promise<MapboxRoute> {
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${depLng},${depLat};${arrLng},${arrLat}` +
    `?geometries=polyline&overview=simplified&alternatives=false`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` }, // ⬅️ pas de token dans la query
  });

  const body = await res.text();
  if (!res.ok) throw new Error(`Mapbox HTTP ${res.status} – ${body}`);

  const json = JSON.parse(body);
  const route = json?.routes?.[0];
  if (!route) throw new Error("No route from Mapbox");

  return {
    distanceKm: route.distance / 1000,
    durationMin: Math.ceil(route.duration / 60),
    polyline5: route.geometry,
  };
}
*/
