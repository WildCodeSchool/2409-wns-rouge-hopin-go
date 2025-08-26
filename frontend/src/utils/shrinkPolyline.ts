// Décime une polyline (precision 5) jusqu'à ce que l'URL construite passe sous maxLen.
import polyline from "@mapbox/polyline";

export function shrinkPolyline5ForStatic(
  encoded: string,
  makeUrl: (enc: string) => string,
  maxLen = 7500
): string {
  const coords = polyline.decode(encoded, 5); // [[lat,lng],...]
  if (coords.length <= 2) return encoded;

  for (let step = 1; step <= 20; step++) {
    const filtered =
      step === 1 ? coords : coords.filter((_, i) => i % step === 0);
    if (filtered[0] !== coords[0]) filtered.unshift(coords[0]);
    if (filtered[filtered.length - 1] !== coords[coords.length - 1]) {
      filtered.push(coords[coords.length - 1]);
    }
    const enc = polyline.encode(filtered, 5);
    const url = makeUrl(enc);
    if (url.length <= maxLen || filtered.length <= 2) return enc;
  }
  // au pire, renvoie la version très décimée
  return polyline.encode([coords[0], coords[coords.length - 1]], 5);
}
