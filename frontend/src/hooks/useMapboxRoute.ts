// hooks/useMapboxRoute.ts
import { useEffect, useState } from "react";

type RouteData = {
  distanceKm: number;
  durationMin: number;
  geometry: GeoJSON.LineString;
};

type Strategy =
  | "cache-first"
  | "cache-only"
  | "network-first"
  | "network-only"
  | "swr";

type UseMapboxRouteOptions = {
  departure: [number, number]; // [lng, lat]
  arrival: [number, number]; // [lng, lat]
  profile?: "driving" | "walking" | "cycling";
  ttlMs?: number;
  maxEntries?: number;
  strategy?: Strategy;
};

type CacheEntry = { route: RouteData; expiresAt: number; lastAccess: number };

const BUCKET = "mapboxDirectionsCacheV1";
const DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 200;

const load = (): Record<string, CacheEntry> => {
  try {
    return JSON.parse(localStorage.getItem(BUCKET) || "{}");
  } catch {
    return {};
  }
};
const save = (obj: Record<string, CacheEntry>) =>
  localStorage.setItem(BUCKET, JSON.stringify(obj));
const pruneLRU = (obj: Record<string, CacheEntry>, max: number) => {
  const keys = Object.keys(obj);
  if (keys.length <= max) return obj;
  keys
    .sort((a, b) => obj[a].lastAccess - obj[b].lastAccess)
    .slice(0, keys.length - max)
    .forEach((k) => delete obj[k]);
  return obj;
};
const norm = (n: number) => Number(n.toFixed(5));
const keyFor = (
  profile: string,
  dlng: number,
  dlat: number,
  alng: number,
  alat: number
) =>
  `${profile}|geojson|${norm(dlng)},${norm(dlat)}->${norm(alng)},${norm(alat)}`;

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

  const dLng = departure[0],
    dLat = departure[1];
  const aLng = arrival[0],
    aLat = arrival[1];

  useEffect(() => {
    const now = Date.now();
    let store = load();

    const key = keyFor(profile, dLng, dLat, aLng, aLat);
    const hit = store[key];
    const fresh = !!hit && hit.expiresAt > now;

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

    if (strategy === "cache-only") {
      serve(hit ?? null);
      setLoading(false);
      return;
    }

    if ((strategy === "cache-first" || strategy === "swr") && fresh) {
      serve(hit);
      setLoading(strategy === "swr");
      if (strategy === "cache-first") return;
    }

    const ctrl = new AbortController();
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

        const routeData: RouteData = {
          distanceKm: data.distance / 1000,
          durationMin: Math.ceil(data.duration / 60), // ✅ minutes entières
          geometry: data.geometry,
        };

        store[key] = {
          route: routeData,
          expiresAt: now + ttlMs,
          lastAccess: now,
        };
        store = pruneLRU(store, maxEntries);
        save(store);

        setRoute(routeData);
      } catch (err: unknown) {
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

    if (strategy !== "cache-first" || !fresh) {
      fetchRoute();
      return () => ctrl.abort();
    } else {
      setLoading(false);
    }
  }, [dLng, dLat, aLng, aLat, profile, ttlMs, maxEntries, strategy]);

  return { route, loading };
}
