import { useEffect, useMemo } from "react";
import polyline from "@mapbox/polyline";
import { fitLineStringToSize } from "../utils/fitStaticViewport";
import { shrinkPolyline5ForStatic } from "../utils/shrinkPolyline";
import streetMap from "../assets/street_map.svg";
import useMapboxRoute from "../hooks/useMapboxRoute";

interface Props {
  departureLatitude: number;
  departureLongitude: number;
  departureCity: string;
  arrivalLatitude: number;
  arrivalLongitude: number;
  arrivalCity: string;
  mapId: string;
  width?: number;
  height?: number;
  zoom?: number;
  bearing?: number;
  pitch?: number;
  fitPaddingPct?: number;
  fitPaddingPx?: number;
  onRouteData?: (d: { distanceKm: number; durationMin: number }) => void;

  // backend-preferred
  routePolyline5?: string | null;
  distanceKm?: number | null;
  durationMin?: number | null;
}

export default function StaticMap({
  departureLatitude,
  departureLongitude,
  departureCity,
  arrivalLatitude,
  arrivalLongitude,
  arrivalCity,
  mapId,
  width = 648,
  height = 300,
  zoom,
  bearing = 0,
  pitch,
  fitPaddingPct = 0.12,
  fitPaddingPx,
  onRouteData,
  routePolyline5,
  distanceKm,
  durationMin,
}: Props) {
  const token =
    "pk.eyJ1IjoiYWRyaWVuZGF2eSIsImEiOiJjbWQ0cXB4M2cwNTB2MmpzYTBheTNkeW1sIn0.mvTc3Mh3ihV-5ngyPkcdCQ";

  // Raccourcis + arrondis pour l’URL
  const fmt = (n: number, p = 5) => Number(n).toFixed(p);
  const start: [number, number] = useMemo(
    () => [Number(fmt(departureLongitude)), Number(fmt(departureLatitude))],
    [departureLongitude, departureLatitude]
  );
  const end: [number, number] = useMemo(
    () => [Number(fmt(arrivalLongitude)), Number(fmt(arrivalLatitude))],
    [arrivalLongitude, arrivalLatitude]
  );

  // 1) Si polyline backend → pas d’appel Directions
  const urlFromPolyline = useMemo(() => {
    if (!routePolyline5) return null;

    // Construire une géométrie (pour calcul de center/zoom auto)
    const coordsLL = polyline.decode(routePolyline5, 5); // [[lat,lng],...]
    const line: GeoJSON.LineString = {
      type: "LineString",
      coordinates: coordsLL.map(([lat, lng]) => [lng, lat]),
    };

    const padPx =
      typeof fitPaddingPx === "number"
        ? fitPaddingPx
        : Math.round(Math.min(width, height) * fitPaddingPct);

    const centerStr =
      typeof zoom === "number"
        ? (() => {
            const { lon, lat } = fitLineStringToSize(line, width, height, 0);
            return [
              fmt(lon),
              fmt(lat),
              Number(zoom).toFixed(2),
              bearing?.toFixed(0),
              ...(pitch != null ? [pitch.toFixed(0)] : []),
            ]
              .filter(Boolean)
              .join(",");
          })()
        : (() => {
            const {
              lon,
              lat,
              zoom: fitZoom,
            } = fitLineStringToSize(line, width, height, padPx);
            return [
              fmt(lon),
              fmt(lat),
              fitZoom.toFixed(2),
              bearing?.toFixed(0),
              ...(pitch != null ? [pitch.toFixed(0)] : []),
            ]
              .filter(Boolean)
              .join(",");
          })();

    // Fabriqueur d’URL (sert aussi à tester la longueur)
    const mk = (enc: string) =>
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
      `path-5+3887be-0.75(${encodeURIComponent(enc)}),` +
      `pin-s-a+8E387C(${fmt(start[0])},${fmt(start[1])}),` +
      `pin-s-b+3887be(${fmt(end[0])},${fmt(end[1])})/` +
      `${centerStr}/${width}x${height}?access_token=${token}`;

    // Si l’URL est trop longue → décime la polyline
    const safePolyline = shrinkPolyline5ForStatic(routePolyline5, mk, 7500);
    return mk(safePolyline);
  }, [
    routePolyline5,
    start,
    end,
    width,
    height,
    zoom,
    bearing,
    pitch,
    fitPaddingPct,
    fitPaddingPx,
    token,
  ]);

  // 2) Fallback Directions uniquement si pas de polyline
  const { route, loading } = useMapboxRoute({
    departure: [departureLongitude, departureLatitude],
    arrival: [arrivalLongitude, arrivalLatitude],
    strategy: routePolyline5 ? "cache-only" : "cache-first",
  });

  // 3) URL finale si pas de polyline (encode depuis GeoJSON) — sans fetch()
  const src = useMemo(() => {
    if (urlFromPolyline) return urlFromPolyline;
    if (!route) return "";

    const encoded = polyline.fromGeoJSON(
      { type: "Feature", geometry: route.geometry, properties: {} },
      5
    );
    const pins =
      `pin-s-a+8E387C(${fmt(start[0])},${fmt(start[1])}),` +
      `pin-s-b+3887be(${fmt(end[0])},${fmt(end[1])})`;

    // mode auto si fallback (URL courte)
    const mk = (enc: string) =>
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
      `path-5+3887be-0.75(${encodeURIComponent(enc)}),${pins}/auto/` +
      `${width}x${height}?access_token=${token}`;

    const safe = shrinkPolyline5ForStatic(encoded, mk, 7500);
    return mk(safe);
  }, [urlFromPolyline, route, start, end, width, height, token]);

  // 4) Remonter les infos (backend prioritaire)
  useEffect(() => {
    if (typeof distanceKm === "number" && typeof durationMin === "number") {
      onRouteData?.({ distanceKm, durationMin });
    } else if (route) {
      onRouteData?.({
        distanceKm: route.distanceKm,
        durationMin: route.durationMin,
      });
    }
  }, [distanceKm, durationMin, route, onRouteData]);

  // 5) Rendu : pas de fetch blob → plus de faux “CORS” si 4xx
  if ((!routePolyline5 && loading) || !src) {
    return (
      <div
        className="bg-gray-200 w-full h-[300px] flex justify-center items-center text-primary rounded-md animate-pulse"
        style={{ backgroundImage: `url(${streetMap})` }}
      >
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <img
      id={mapId}
      src={src}
      width={width}
      height={height}
      alt={`Trajet ${departureCity} → ${arrivalCity}`}
      className="w-full h-[300px] object-cover rounded-md"
      loading="lazy"
      onError={(e) => {
        // fallback ultime : centre auto sans path si jamais
        (e.currentTarget as HTMLImageElement).src =
          `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
          `pin-s-a+8E387C(${fmt(start[0])},${fmt(start[1])}),` +
          `pin-s-b+3887be(${fmt(end[0])},${fmt(end[1])})/auto/` +
          `${width}x${height}?access_token=${token}`;
      }}
    />
  );
}
