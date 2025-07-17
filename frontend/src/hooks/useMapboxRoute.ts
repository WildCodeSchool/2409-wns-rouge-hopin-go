import { useEffect, useState } from "react";

type RouteData = {
  distanceKm: number;
  durationMin: number;
  geometry: GeoJSON.LineString;
};

type UseMapboxRouteOptions = {
  departure: [number, number];
  arrival: [number, number];
};

const cache = new Map<string, RouteData>();

// const mapBoxToken =
//   "pk.eyJ1IjoiYWRyaWVuZGF2eSIsImEiOiJjbWQ0ODUzeTAwYmtlMm1xdTNmbGVhcTFnIn0.D9mVnHnsy9Z-2FX-hL2sJg";

export default function useMapboxRoute({
  departure,
  arrival,
}: UseMapboxRouteOptions) {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = `${departure.join(",")}-${arrival.join(",")}`;

    if (cache.has(key)) {
      setRoute(cache.get(key)!);
      setLoading(false);
      return;
    }

    const fetchRoute = async () => {
      setLoading(true);
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${departure[0]},${departure[1]};${arrival[0]},${arrival[1]}?geometries=geojson&access_token=${mapBoxToken}`;

        const response = await fetch(url);
        const json = await response.json();
        const data = json.routes?.[0];

        if (!data) throw new Error("Aucune route trouvée");

        const routeData: RouteData = {
          distanceKm: data.distance / 1000,
          durationMin: Math.ceil(data.duration / 60),
          geometry: data.geometry,
        };

        cache.set(key, routeData);
        setRoute(routeData);
      } catch (err) {
        console.error("Erreur Mapbox route:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [departure, arrival]);

  return { route, loading };
}
