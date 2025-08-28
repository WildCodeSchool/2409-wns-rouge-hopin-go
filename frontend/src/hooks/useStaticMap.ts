import { useEffect, useState } from "react";

type UseStaticMapOptions = {
  styleId: string;
  username: string;
  lon: number;
  lat: number;
  zoom: number;
  width: number;
  height: number;
  overlay?: string; // optionnel (marker, path, etc.)
};

const staticCache = new Map<string, string>(
  JSON.parse(localStorage.getItem("mapboxStaticCache") || "[]")
);

function saveStaticCache() {
  localStorage.setItem(
    "mapboxStaticCache",
    JSON.stringify(Array.from(staticCache.entries()))
  );
}

const mapBoxToken =
  "pk.eyJ1IjoiYWRyaWVuZGF2eSIsImEiOiJjbWQ0ODUzeTAwYmtlMm1xdTNmbGVhcTFnIn0.D9mVnHnsy9Z-2FX-hL2sJg";

export default function useStaticMap({
  styleId,
  username,
  lon,
  lat,
  zoom,
  width,
  height,
  overlay = "",
}: UseStaticMapOptions) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = `${styleId}-${lon},${lat}-${zoom}-${width}x${height}-${overlay}`;

    if (staticCache.has(key)) {
      setImageUrl(staticCache.get(key)!);
      setLoading(false);
      return;
    }

    const fetchStatic = async () => {
      setLoading(true);
      try {
        const url = `https://api.mapbox.com/styles/v1/${username}/${styleId}/static/${overlay}${
          overlay ? "/" : ""
        }${lon},${lat},${zoom}/${width}x${height}?access_token=${mapBoxToken}`;

        const res = await fetch(url);
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);

        staticCache.set(key, objectUrl);
        saveStaticCache();

        setImageUrl(objectUrl);
      } catch (err) {
        console.error("Erreur Mapbox static image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatic();
  }, [styleId, username, lon, lat, zoom, width, height, overlay]);

  return { imageUrl, loading };
}
