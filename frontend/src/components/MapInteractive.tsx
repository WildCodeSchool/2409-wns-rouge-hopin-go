// components/Map.tsx
import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import polyline from "@mapbox/polyline";
import useMapboxRoute from "../hooks/useMapboxRoute";

interface MapInteractiveProps {
  departureLatitude: number; // lat
  departureLongitude: number; // lng
  departureCity: string;
  arrivalLatitude: number; // lat
  arrivalLongitude: number; // lng
  arrivalCity: string;
  zoomLevel?: number;
  mapId: string;
  onRouteData?: (data: { distanceKm: number; durationMin: number }) => void;

  // 🔹 Nouveau : fournit ces props pour éviter tout appel Directions
  routePolyline5?: string; // polyline precision 5 (backend)
  distanceKm?: number; // distance calculée backend
  durationMin?: number; // durée calculée backend

  // Optionnel : utile si la carte est rendue dans une modale avec animation
  visible?: boolean; // déclenche resize() quand passe à true
  styleUrl?: string; // override du style si besoin
}

export default function MapInteractive({
  departureLatitude,
  departureLongitude,
  departureCity,
  arrivalLatitude,
  arrivalLongitude,
  arrivalCity,
  zoomLevel = 13,
  mapId,
  onRouteData,
  routePolyline5,
  distanceKm,
  durationMin,
  visible = true,
  styleUrl = "mapbox://styles/mapbox/streets-v12",
}: MapInteractiveProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // garder le callback stable sans casser les deps
  const onRouteDataRef = useRef(onRouteData);
  useEffect(() => {
    onRouteDataRef.current = onRouteData;
  }, [onRouteData]);

  // 1) Si polyline backend fournie → construire la géométrie localement (0 réseau)
  const geometryFromPolyline: GeoJSON.LineString | null = useMemo(() => {
    if (!routePolyline5) return null;
    // decode renvoie [[lat,lng]...]; convertir en [lng,lat]
    const latlngs = polyline.decode(routePolyline5, 5);
    const coords = latlngs.map(([lat, lng]) => [lng, lat] as [number, number]);
    return { type: "LineString", coordinates: coords };
  }, [routePolyline5]);

  // 2) Fallback : anciens trajets sans polyline → Directions (cache-first)
  const dep = useMemo(
    () => [departureLongitude, departureLatitude] as [number, number],
    [departureLongitude, departureLatitude]
  );
  const arr = useMemo(
    () => [arrivalLongitude, arrivalLatitude] as [number, number],
    [arrivalLongitude, arrivalLatitude]
  );
  const { route, loading } = useMapboxRoute({
    departure: dep,
    arrival: arr,
    strategy: "cache-first",
  });

  // 3) Source finale à afficher (polyline -> route.geojson -> null)
  const line: GeoJSON.LineString | null =
    geometryFromPolyline ?? route?.geometry ?? null;

  // 4) Données meta (distance/durée) : backend > fallback Directions
  const finalDistanceKm =
    typeof distanceKm === "number" ? distanceKm : route?.distanceKm;
  const finalDurationMin =
    typeof durationMin === "number" ? durationMin : route?.durationMin;

  const isLoading = !line && loading;

  // Helper de destruction safe (évite double remove en StrictMode)
  const destroyMap = () => {
    const m = mapRef.current;
    if (m) {
      try {
        m.remove();
      } catch (e) {
        // ignore en dev
        console.warn("map.remove() ignoré:", e);
      } finally {
        mapRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current || !line) return;

    // access token
    mapboxgl.accessToken =
      import.meta.env?.VITE_MAPBOX_TOKEN ??
      "pk.eyJ1IjoiYWRyaWVuZGF2eSIsImEiOiJjbWQ0cXB4M2cwNTB2MmpzYTBheTNkeW1sIn0.mvTc3Mh3ihV-5ngyPkcdCQ";

    // nettoie toute instance précédente
    destroyMap();

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [departureLongitude, departureLatitude], // [lng, lat]
      zoom: zoomLevel,
    });
    mapRef.current = map;

    const depLngLat: [number, number] = [departureLongitude, departureLatitude];
    const arrLngLat: [number, number] = [arrivalLongitude, arrivalLatitude];

    map.once("load", () => {
      // marqueurs
      new mapboxgl.Marker({ color: "#8E387C" })
        .setLngLat(depLngLat)
        .setPopup(new mapboxgl.Popup().setText(departureCity))
        .addTo(map);

      new mapboxgl.Marker({ color: "#3887be" })
        .setLngLat(arrLngLat)
        .setPopup(new mapboxgl.Popup().setText(arrivalCity))
        .addTo(map);

      // source + couche de la route
      const feature: GeoJSON.Feature<GeoJSON.LineString> = {
        type: "Feature",
        properties: {},
        geometry: line,
      };
      map.addSource("route", { type: "geojson", data: feature });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });

      // fit sur la géométrie
      const coords = line.coordinates as [number, number][];
      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new mapboxgl.LngLatBounds(coords[0], coords[0])
      );
      map.fitBounds(bounds, { padding: 40 });

      // envoie meta vers le parent (si dispo)
      if (
        typeof finalDistanceKm === "number" &&
        typeof finalDurationMin === "number"
      ) {
        onRouteDataRef.current?.({
          distanceKm: finalDistanceKm,
          durationMin: finalDurationMin,
        });
      }

      // modale / animation : assure la taille finale
      requestAnimationFrame(() => map.resize());
    });

    return () => {
      destroyMap();
    };
    // deps : tout ce qui change réellement l'instance ou les données
  }, [
    line,
    departureLongitude,
    departureLatitude,
    arrivalLongitude,
    arrivalLatitude,
    departureCity,
    arrivalCity,
    zoomLevel,
    styleUrl,
    finalDistanceKm,
    finalDurationMin,
  ]);

  // resize quand la modale devient visible
  useEffect(() => {
    if (visible && mapRef.current) {
      requestAnimationFrame(() => mapRef.current!.resize());
    }
  }, [visible]);

  if (isLoading) {
    return (
      <div className="bg-gray-200 w-full h-full flex justify-center items-center text-primary">
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={mapId}
      style={{ width: "100%", height: "100%", borderRadius: "8px" }}
      className="map-container"
    />
  );
}
