import { useEffect, useRef } from "react";
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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const { route, loading } = useMapboxRoute({
    departure: [departureLongitude, departureLatitude],
    arrival: [arrivalLongitude, arrivalLatitude],
  });

  useEffect(() => {
    if (!mapContainerRef.current || !route) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWRyaWVuZGF2eSIsImEiOiJjbWQ0ODUzeTAwYmtlMm1xdTNmbGVhcTFnIn0.D9mVnHnsy9Z-2FX-hL2sJg";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [departureLatitude, departureLongitude],
      zoom: zoomLevel,
    });

    mapRef.current = map;

    // Marqueurs
    new mapboxgl.Marker({ color: "#8E387C" })
      .setLngLat([departureLatitude, departureLongitude])
      .setPopup(new mapboxgl.Popup().setText(departureCity))
      .addTo(map);

    new mapboxgl.Marker({ color: "#3887be" })
      .setLngLat([arrivalLatitude, arrivalLongitude])
      .setPopup(new mapboxgl.Popup().setText(arrivalCity))
      .addTo(map);

    map.on("load", () => {
      const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
        type: "Feature",
        properties: {},
        geometry: route.geometry,
      };

      const bounds = route.geometry.coordinates.reduce(
        (b, coord) => b.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(
          [route.geometry.coordinates[0][0], route.geometry.coordinates[0][1]],
          [route.geometry.coordinates[0][0], route.geometry.coordinates[0][1]]
        )
      );

      map.fitBounds(bounds, { padding: 40 });

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

      onRouteData?.({
        distanceKm: route.distanceKm,
        durationMin: route.durationMin,
      });
    });

    return () => {
      map.remove();
    };
  }, [
    route,
    departureLatitude,
    departureLongitude,
    departureCity,
    arrivalLatitude,
    arrivalLongitude,
    arrivalCity,
    zoomLevel,
    onRouteData,
  ]);

  if (loading) {
    return (
      <div className=" bg-gray-200 w-full h-[300px] flex justify-center items-center text-primary">
        <p>Chargement de la carte...</p>
      </div>
    );
  }
  return (
    <div
      ref={mapContainerRef}
      id={mapId}
      style={{ width: "100%", height: "300px", borderRadius: "8px" }}
      className="map-container"
    />
  );
}
