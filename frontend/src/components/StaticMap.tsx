import { useEffect, useMemo } from "react";
import { buildStaticRouteUrl } from "../utils/buildStaticRouteUrl";
import useMapboxRoute from "../hooks/useMapboxRoute";
import { useStaticRouteImage } from "../hooks/useStaticRouteImage";
import { fitLineStringToSize } from "../utils/fitStaticViewport";
import streetMap from "../assets/street_map.svg";

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
  zoom?: number; // si défini, on ignore le fit auto
  bearing?: number;
  pitch?: number;
  fitPaddingPct?: number; // ex. 0.12 (12%) — prioritaire si défini
  fitPaddingPx?: number; // sinon, padding absolu en px
  onRouteData?: (d: { distanceKm: number; durationMin: number }) => void;
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
  fitPaddingPct = 0.12, // 👍 marge par défaut 12%
  fitPaddingPx,
  onRouteData,
}: Props) {
  const { route, loading } = useMapboxRoute({
    departure: [departureLongitude, departureLatitude],
    arrival: [arrivalLongitude, arrivalLatitude],
  });

  useEffect(() => {
    if (!route) return;
    onRouteData?.({
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
    });
  }, [route, onRouteData]);

  const token =
    "pk.eyJ1IjoiYWRyaWVuZGF2eSIsImEiOiJjbWQ0cXB4M2cwNTB2MmpzYTBheTNkeW1sIn0.mvTc3Mh3ihV-5ngyPkcdCQ";
  const start: [number, number] = [departureLongitude, departureLatitude];
  const end: [number, number] = [arrivalLongitude, arrivalLatitude];

  const centerParams = useMemo(() => {
    if (!route) return { mode: "auto" as const };
    if (typeof zoom === "number") {
      // zoom forcé: on centre au milieu du trajet
      const { lon, lat } = fitLineStringToSize(
        route.geometry,
        width,
        height,
        0
      );
      return { mode: "center" as const, lon, lat, zoom, bearing, pitch };
    }
    // auto + padding (px)
    const padPx =
      typeof fitPaddingPx === "number"
        ? fitPaddingPx
        : Math.round(Math.min(width, height) * fitPaddingPct);
    let lon = 0,
      lat = 0,
      fitZoom = 0;
    if (route && route.geometry) {
      const fitResult = fitLineStringToSize(
        route.geometry,
        width,
        height,
        padPx
      );
      lon = fitResult.lon;
      lat = fitResult.lat;
      fitZoom = fitResult.zoom;
    }
    return { mode: "center" as const, lon, lat, zoom: fitZoom, bearing, pitch };
  }, [route, width, height, zoom, bearing, pitch, fitPaddingPct, fitPaddingPx]);

  const urlKey = {
    start,
    end,
    width,
    height,
    center: centerParams,
    geometry: route?.geometry,
  };
  const { src, loading: imgLoading } = useStaticRouteImage(urlKey, () => {
    if (!route) return "";
    return buildStaticRouteUrl({
      start,
      end,
      geometry: route.geometry,
      width,
      height,
      center: centerParams,
      token,
    });
  });

  if (loading || imgLoading || !src) {
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
    />
  );
}
