import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  departureLatitude: number;
  departureLongitude: number;
  departureCity: string;
  zoomLevel?: number;
  mapId: string; // 👈 nouveau
}

export default function Map({
  departureLatitude,
  departureLongitude,
  departureCity,
  zoomLevel = 13,
  mapId,
}: MapProps) {
  const mapRef = useRef<L.Map>();

  useEffect(() => {
    const container = document.getElementById(mapId);
    if (!container) return;

    const map = L.map(container).setView(
      [departureLatitude, departureLongitude],
      zoomLevel
    );
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([departureLatitude, departureLongitude])
      .addTo(map)
      .bindPopup(`${departureCity}`)
      .openPopup();

    return () => {
      map.remove();
    };
  }, [departureLatitude, departureLongitude, departureCity, zoomLevel, mapId]);

  return <div id={mapId} style={{ height: "400px", borderRadius: "8px" }} />;
}
