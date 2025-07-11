import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  useEffect(() => {
    const map = L.map("map").setView([48.8584, 2.2945], 13); // coordonnées de Paris

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([48.8584, 2.2945]).addTo(map).bindPopup("Tour Eiffel").openPopup();
  }, []);

  return <div id="map" style={{ height: "400px", borderRadius: "8px" }} />;
}
