import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useMapboxRoute from "../hooks/useMapboxRoute";

interface MapProps {
  departureLatitude: number;
  departureLongitude: number;
  departureCity: string;
  arrivalLatitude: number;
  arrivalLongitude: number;
  arrivalCity: string;
  zoomLevel?: number;
  mapId: string;
  onRouteData?: (data: { distanceKm: number; durationMin: number }) => void;
}

export default function Map({
  departureLatitude,
  departureLongitude,
  departureCity,
  arrivalLatitude,
  arrivalLongitude,
  arrivalCity,
  zoomLevel = 13,
  mapId,
  onRouteData,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // 🔒 ne pas remettre onRouteData dans les deps
  const onRouteDataRef = useRef(onRouteData);
  useEffect(() => {
    onRouteDataRef.current = onRouteData;
  }, [onRouteData]);

  // ✅ hook avec cache persistant que tu viens d’installer
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

  // Helper de destruction safe (évite double remove)
  const destroyMap = () => {
    const m = mapRef.current;
    if (m) {
      try {
        m.remove();
      } catch (e) {
        // En dev/StrictMode, ignorer les erreurs de double remove
        console.warn("map.remove() ignoré:", e);
      } finally {
        mapRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current || !route) return;

    // 🔄 Nettoyage de toute instance précédente avant de créer la nouvelle
    destroyMap();

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWRyaWVuZGF2eSIsImEiOiJjbWQ0cXB4M2cwNTB2MmpzYTBheTNkeW1sIn0.mvTc3Mh3ihV-5ngyPkcdCQ";

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [departureLongitude, departureLatitude], // ✅ [lng, lat]
      zoom: zoomLevel,
    });
    mapRef.current = map;

    const dep: [number, number] = [departureLongitude, departureLatitude];
    const arr: [number, number] = [arrivalLongitude, arrivalLatitude];

    map.once("load", () => {
      // Marqueurs
      new mapboxgl.Marker({ color: "#8E387C" })
        .setLngLat(dep)
        .setPopup(new mapboxgl.Popup().setText(departureCity))
        .addTo(map);

      new mapboxgl.Marker({ color: "#3887be" })
        .setLngLat(arr)
        .setPopup(new mapboxgl.Popup().setText(arrivalCity))
        .addTo(map);

      // Route
      const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
        type: "Feature",
        properties: {},
        geometry: route.geometry,
      };

      const coords = route.geometry.coordinates as [number, number][];
      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new mapboxgl.LngLatBounds(coords[0], coords[0])
      );

      map.addSource("route", { type: "geojson", data: geojson });
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

      map.fitBounds(bounds, { padding: 40 });

      // Données vers le parent (sans casser les deps)
      onRouteDataRef.current?.({
        distanceKm: route.distanceKm,
        durationMin: route.durationMin,
      });

      // Modal fraîchement ouverte → s'assure du bon sizing
      requestAnimationFrame(() => map.resize());
    });

    return () => {
      destroyMap();
    };
    // ❗ Pas de city/onRouteData dans les deps
  }, [
    arrivalCity,
    arrivalLatitude,
    arrivalLongitude,
    departureCity,
    departureLatitude,
    departureLongitude,
    route,
    zoomLevel,
  ]);

  if (loading) {
    return (
      <div className="bg-gray-200 w-full h-[300px] flex justify-center items-center text-primary">
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={mapId}
      style={{ width: "100%", height: "300px", borderRadius: "8px" }}
      className="map-container"
    />
  );
}
