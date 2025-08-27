// utils/fitStaticViewport.ts
// Calcule center (lon,lat) + zoom pour faire rentrer une LineString dans (width x height)
// en Web Mercator avec un padding (px). Compatible Static Images API.
// Hypothèses: coords en [lon, lat]. TILE_SIZE=512 (Mapbox).
const TILE_SIZE = 512;
const MAX_LAT = 85.05112878;

function clampLat(lat: number) {
  return Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
}

function lngLatToWorldNorm(lon: number, lat: number) {
  const x = (lon + 180) / 360; // 0..1
  const s = Math.sin((clampLat(lat) * Math.PI) / 180);
  const y = 0.5 - (0.25 * Math.log((1 + s) / (1 - s))) / Math.PI; // 0..1
  return [x, y] as const;
}

function worldNormToLngLat(x: number, y: number) {
  const lon = x * 360 - 180;
  const y2 = (0.5 - y) * 2 * Math.PI;
  const lat = (180 / Math.PI) * Math.atan(Math.sinh(y2));
  return [lon, lat] as const;
}

export function fitLineStringToSize(
  geometry: GeoJSON.LineString,
  width: number,
  height: number,
  paddingPx = 40,
  zoomMin = 0,
  zoomMax = 20
) {
  const coords = geometry.coordinates as [number, number][];
  if (!coords.length) {
    return { lon: 0, lat: 0, zoom: zoomMin };
  }
  // BBox en mercator normalisé
  let minX = +Infinity,
    minY = +Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const [lon, lat] of coords) {
    const [x, y] = lngLatToWorldNorm(lon, lat);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  // Gestion simple de l'antiméridien (peu utile en France, mais safe)
  const spanX = maxX - minX;
  const dx = Math.min(spanX, 1 - spanX); // wrap-aware
  const dy = maxY - minY;

  // Cas point/segment quasi nul → zoom par défaut confortable
  const EPS = 1e-9;
  if (dx < EPS && dy < EPS) {
    const [lon, lat] = coords[0];
    return { lon, lat, zoom: 14 };
  }

  const innerW = Math.max(1, width - 2 * paddingPx);
  const innerH = Math.max(1, height - 2 * paddingPx);

  // Nombre de pixels monde à ce zoom: worldPx = TILE_SIZE * 2^z
  // On veut: worldPx*dx <= innerW  et  worldPx*dy <= innerH
  // => 2^z <= innerW/(TILE_SIZE*dx)  et  2^z <= innerH/(TILE_SIZE*dy)
  // => z <= log2(...) ; on prend le min des deux (fit sur les deux axes)
  const zx = dx > EPS ? Math.log2(innerW / (TILE_SIZE * dx)) : zoomMax;
  const zy = dy > EPS ? Math.log2(innerH / (TILE_SIZE * dy)) : zoomMax;
  let zoom = Math.min(zx, zy);
  zoom = Math.max(zoomMin, Math.min(zoomMax, zoom));

  // Centre mercator normalisé (pas juste moyenne en lon/lat)
  // NB: pour l'antiméridien, un vrai recentrage wrap-aware serait plus long;
  // ici on reste simple (suffisant pour l'Europe).
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const [lon, lat] = worldNormToLngLat(cx, cy);

  return { lon, lat, zoom };
}
