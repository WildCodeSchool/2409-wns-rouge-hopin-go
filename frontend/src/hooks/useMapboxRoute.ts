// hooks/useMapboxRoute.ts
import { useEffect, useState } from "react";

/**
 * Hook React pour obtenir un itinéraire Mapbox Directions avec cache persistant (localStorage).
 *
 * Objectifs :
 * - Éviter les appels répétés : on persiste les réponses dans localStorage (clé BUCKET).
 * - Contrôler la politique de lecture réseau via plusieurs stratégies (cache-first, swr, etc.).
 * - Limiter la taille du cache avec un LRU simple (Least Recently Used).
 *
 * Stratégies supportées :
 * - "cache-first"   : si cache frais → renvoie le cache, sinon → fetch ; pas de revalidation.
 * - "cache-only"    : ne lit *que* le cache ; jamais d'appel réseau.
 * - "network-first" : essaye le réseau, sinon fallback sur le cache si existant.
 * - "network-only"  : ignore totalement le cache (toujours réseau).
 * - "swr"           : renvoie immédiatement le cache *s'il est frais* puis revalide en arrière-plan
 *                     (ici : on met loading=true pour signaler la revalidation et on fait un fetch).
 *
 * Notes :
 * - Les coordonnées sont normalisées à 5 décimales (~1 m) pour construire la clé de cache,
 *   ce qui évite d’avoir des clés différentes pour des variations insignifiantes.
 * - La réponse stockée inclut la géométrie en GeoJSON (geometries=geojson).
 * - Le token actuel est *public* (pk.…). Pour de la prod, préférer un backend qui appelle Directions
 *   avec un token secret (sk.…), puis renvoyer uniquement polyline/distance/durée au front.
 */

type RouteData = {
  distanceKm: number;
  durationMin: number;
  geometry: GeoJSON.LineString;
};

type Strategy = "cache-first" | "cache-only" | "network-first" | "network-only" | "swr";

type UseMapboxRouteOptions = {
  departure: [number, number]; // [lng, lat]
  arrival: [number, number]; // [lng, lat]
  profile?: "driving" | "walking" | "cycling";
  ttlMs?: number; // durée de fraicheur d’une entrée
  maxEntries?: number; // taille max du cache (LRU au-delà)
  strategy?: Strategy; // politique d’accès réseau/cache
};

type CacheEntry = { route: RouteData; expiresAt: number; lastAccess: number };

// 💾 Nom du "bucket" localStorage
const BUCKET = "mapboxDirectionsCacheV1";
// ⏱️ TTL par défaut : 7 jours
const DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000;
// 🧺 Taille max du cache (entrées)
const DEFAULT_MAX_ENTRIES = 200;

// Helpers de persistance localStorage
const load = (): Record<string, CacheEntry> => {
  try {
    return JSON.parse(localStorage.getItem(BUCKET) || "{}");
  } catch {
    return {};
  }
};
const save = (obj: Record<string, CacheEntry>) => localStorage.setItem(BUCKET, JSON.stringify(obj));

/**
 * Supprime les entrées les moins récemment utilisées si on dépasse `max`.
 * Trie par lastAccess croissant, puis supprime l’excédent.
 */
const pruneLRU = (obj: Record<string, CacheEntry>, max: number) => {
  const keys = Object.keys(obj);
  if (keys.length <= max) return obj;
  keys
    .sort((a, b) => obj[a].lastAccess - obj[b].lastAccess)
    .slice(0, keys.length - max)
    .forEach((k) => delete obj[k]);
  return obj;
};

// Normalise à 5 décimales (~1 m) pour stabiliser la clé
const norm = (n: number) => Number(n.toFixed(5));

/**
 * Clé de cache : inclut le profil (driving/walking/cycling),
 * le format (geojson pour la géométrie), et les coords normalisées.
 */
const keyFor = (profile: string, dlng: number, dlat: number, alng: number, alat: number) =>
  `${profile}|geojson|${norm(dlng)},${norm(dlat)}->${norm(alng)},${norm(alat)}`;

// ⚠️ Token public. En prod, préférez un backend pour Directions.
const mapBoxToken =
  "pk.eyJ1IjoiYWRyaWVuZGF2eSIsImEiOiJjbWQ0cXB4M2cwNTB2MmpzYTBheTNkeW1sIn0.mvTc3Mh3ihV-5ngyPkcdCQ";

export default function useMapboxRoute({
  departure,
  arrival,
  profile = "driving",
  ttlMs = DEFAULT_TTL,
  maxEntries = DEFAULT_MAX_ENTRIES,
  strategy = "cache-first",
}: UseMapboxRouteOptions) {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);

  // Déstructure en scalaires pour éviter que les deps du useEffect
  // ne changent à chaque render (stabilité des dépendances)
  const dLng = departure[0],
    dLat = departure[1];
  const aLng = arrival[0],
    aLat = arrival[1];

  useEffect(() => {
    const now = Date.now();
    let store = load();

    // 🔑 Construire la clé de cache pour ces paramètres
    const key = keyFor(profile, dLng, dLat, aLng, aLat);
    const hit = store[key];
    const fresh = !!hit && hit.expiresAt > now;

    // Sert une entrée (met à jour lastAccess + persiste)
    const serve = (entry: CacheEntry | null) => {
      if (entry) {
        entry.lastAccess = now;
        store[key] = entry;
        save(store);
        setRoute(entry.route);
      } else {
        setRoute(null);
      }
    };

    // 1) Stratégie cache-only : jamais de réseau
    if (strategy === "cache-only") {
      serve(hit ?? null);
      setLoading(false);
      return;
    }

    // 2) cache-first / swr : si cache frais, on le sert immédiatement
    if ((strategy === "cache-first" || strategy === "swr") && fresh) {
      serve(hit);
      // en SWR, on signale une revalidation possible (loading=true)
      setLoading(strategy === "swr");
      if (strategy === "cache-first") return; // cache-first → pas de revalidation réseau
    }

    // 3) Prépare un abort controller pour annuler le fetch lors d’un unmount
    const ctrl = new AbortController();

    // 4) Chemin réseau (network-first / network-only / swr revalidation / cache-first sans hit)
    const fetchRoute = async () => {
      try {
        const url =
          `https://api.mapbox.com/directions/v5/mapbox/${profile}/` +
          `${dLng},${dLat};${aLng},${aLat}` +
          `?geometries=geojson&access_token=${mapBoxToken}`;

        const response = await fetch(url, { signal: ctrl.signal });
        const json = await response.json();
        const data = json.routes?.[0];
        if (!data) throw new Error("Aucune route trouvée");

        // 📦 Formate la réponse pour le cache + état local
        const routeData: RouteData = {
          distanceKm: data.distance / 1000,
          durationMin: Math.ceil(data.duration / 60), // minutes entières
          geometry: data.geometry, // GeoJSON LineString
        };

        // 📝 Persiste dans le cache + LRU prune
        store[key] = {
          route: routeData,
          expiresAt: now + ttlMs,
          lastAccess: now,
        };
        store = pruneLRU(store, maxEntries);
        save(store);

        setRoute(routeData);
      } catch (err: unknown) {
        // network-first : si réseau KO, tente le fallback cache
        if (strategy === "network-first" && hit) {
          serve(hit);
        } else if (
          typeof err === "object" &&
          err !== null &&
          "name" in err &&
          (err as { name?: string }).name !== "AbortError"
        ) {
          console.error("Erreur Mapbox route:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    // 5) Décide si on déclenche un fetch selon la stratégie + fraicheur
    if (
      strategy === "network-only" || // toujours réseau
      strategy === "network-first" || // tente réseau
      strategy === "swr" || // revalide
      (strategy === "cache-first" && !fresh) // pas de cache → réseau
    ) {
      fetchRoute();
      return () => ctrl.abort();
    }

    // 6) cache-first avec hit frais déjà servi → pas d’appel
    setLoading(false);
  }, [dLng, dLat, aLng, aLat, profile, ttlMs, maxEntries, strategy]);

  return { route, loading };
}
