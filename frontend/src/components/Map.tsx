import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const mapBoxToken =
    "pk.eyJ1IjoiYWRyaWVuZGF2eSIsImEiOiJjbWQ0ODUzeTAwYmtlMm1xdTNmbGVhcTFnIn0.D9mVnHnsy9Z-2FX-hL2sJg";

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = mapBoxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [departureLongitude, departureLatitude],
      zoom: zoomLevel,
    });

    mapRef.current = map;

    // Marqueurs
    new mapboxgl.Marker({ color: "#8E387C" })
      .setLngLat([departureLongitude, departureLatitude])
      .setPopup(new mapboxgl.Popup().setText(departureCity))
      .addTo(map);

    new mapboxgl.Marker({ color: "#3887be" })
      .setLngLat([arrivalLongitude, arrivalLatitude])
      .setPopup(new mapboxgl.Popup().setText(arrivalCity))
      .addTo(map);

    const getRoute = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${departureLongitude},${departureLatitude};${arrivalLongitude},${arrivalLatitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      const response = await fetch(url);
      const json = await response.json();

      const data = json.routes[0];
      console.log("🚀 ~ getRoute ~ data:", data);

      if (!json.routes || !json.routes[0]) {
        console.error("❌ Aucune route trouvée :", json);
        return;
      }

      const route = json.routes[0].geometry;
      const geojson: GeoJSON.Feature<
        GeoJSON.LineString,
        GeoJSON.GeoJsonProperties
      > = {
        type: "Feature",
        properties: {},
        geometry: route,
      };

      const distanceKm = data.distance / 1000;
      const durationMin = Math.ceil(data.duration / 60);
      onRouteData?.({ distanceKm, durationMin });

      // Centrer la carte sur la route
      const bounds = route.coordinates.reduce(
        (b: mapboxgl.LngLatBounds, coord: number[]) =>
          b.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(route.coordinates[0], route.coordinates[0])
      );

      map.fitBounds(bounds, { padding: 40 });

      // Tracer la route
      if (map.getSource("route")) {
        (map.getSource("route") as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource("route", {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }
    };

    map.on("load", getRoute);

    return () => {
      map.remove();
    };
  }, [
    departureLatitude,
    departureLongitude,
    arrivalLatitude,
    arrivalLongitude,
    departureCity,
    arrivalCity,
    zoomLevel,
    mapBoxToken,
    onRouteData,
  ]);

  return (
    <div
      ref={mapContainerRef}
      id={mapId}
      style={{ width: "100%", height: "300px", borderRadius: "8px" }}
      className="map-container"
    />
  );
}
