export const calculateRidePrice = (
  distanceKm: number | undefined,
  maxPassenger: number,
  nbPassenger: number
): number => {
  const basePricePerKm = 0.14;

  if (!distanceKm) return 0;

  // Cas 1 : courte distance → tarif fixe
  if (distanceKm <= 10) return 3;

  const fullPrice = distanceKm * basePricePerKm;

  // Cas 2 : une seule place dispo → moitié prix
  if (maxPassenger === 1) return +(fullPrice / 2).toFixed(2);

  // Cas 3 : aucune place prise → plein tarif
  if (nbPassenger === 0) return +fullPrice.toFixed(2);

  // Cas 4 : tarif réduit en fonction des places déjà réservées
  const fillRatio = nbPassenger / maxPassenger;
  const adjustedPrice = fullPrice * (1 - fillRatio);

  return +Math.max(adjustedPrice, 1).toFixed(2); // sécurité plancher
};
