export function formatTravelDuration(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes)) return "";
  const minutes = Math.round(totalMinutes); // évite les décimales
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) return `${m} min`; // 48 -> "48 min"
  if (m === 0) return `${h}h`; // 120 -> "2h"
  return `${h}h${String(m).padStart(2, "0")}`; // 102 -> "1h42"
}
