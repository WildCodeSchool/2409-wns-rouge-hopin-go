// services/mapbox.ts
import fetch from "node-fetch";

const TOKEN = process.env.MAPBOX_DIRECTIONS_TOKEN;
if (!TOKEN) throw new Error("Missing MAPBOX_DIRECTIONS_TOKEN");

type MapboxRoute = {
  distanceKm: number;
  durationMin: number;
  polyline5: string; // précision 5
};

export async function fetchRouteFromMapbox(
  depLng: number,
  depLat: number,
  arrLng: number,
  arrLat: number
): Promise<MapboxRoute> {
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${depLng},${depLat};${arrLng},${arrLat}` +
    `?geometries=polyline&overview=simplified&alternatives=false` + // polyline courte
    `&access_token=${encodeURIComponent(TOKEN as string)}`; // ⬅️ ICI

  const res = await fetch(url);
  const body = await res.text();
  if (!res.ok) throw new Error(`Mapbox HTTP ${res.status} – ${body}`);

  const json = JSON.parse(body);
  const route = json?.routes?.[0];
  if (!route) throw new Error("No route from Mapbox");

  return {
    distanceKm: route.distance / 1000,
    durationMin: Math.ceil(route.duration / 60),
    polyline5: route.geometry, // déjà en polyline(5)
  };
}
