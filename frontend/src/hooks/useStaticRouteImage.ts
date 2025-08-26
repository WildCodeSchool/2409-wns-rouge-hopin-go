// hooks/useStaticRouteImage.ts
import { useEffect, useState } from "react";

type CacheEntry = { dataUrl: string; expiresAt: number };
const BUCKET = "mapboxStaticCache";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

function getCache(): Record<string, CacheEntry> {
  try {
    return JSON.parse(localStorage.getItem(BUCKET) || "{}");
  } catch {
    return {};
  }
}
function setCache(obj: Record<string, CacheEntry>) {
  localStorage.setItem(BUCKET, JSON.stringify(obj));
}
async function blobToDataURL(blob: Blob) {
  return new Promise<string>((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
}

export function useStaticRouteImage(
  urlKey: unknown,
  urlBuilder: () => Promise<string> | string
) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const key = typeof urlKey === "string" ? urlKey : JSON.stringify(urlKey);
    const now = Date.now();
    const cache = getCache();
    const hit = cache[key];

    async function run() {
      setLoading(true);
      try {
        if (hit && hit.expiresAt > now) {
          if (mounted) setSrc(hit.dataUrl);
          return;
        }
        const url =
          typeof urlBuilder === "function" ? await urlBuilder() : urlBuilder;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        const dataUrl = await blobToDataURL(blob);

        cache[key] = { dataUrl, expiresAt: now + TTL_MS };
        setCache(cache);
        if (mounted) setSrc(dataUrl);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [urlKey, urlBuilder]);

  return { src, loading };
}
