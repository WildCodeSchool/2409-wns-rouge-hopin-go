// utils/pricingSql.ts
import { SelectQueryBuilder } from "typeorm";
import { Ride } from "../entities/Ride";

export type PricingParams = {
  perKm: number; // e.g. 0.14
  minFare: number; // e.g. 2.5
  minFareKm: number; // e.g. 10
  roundTo: number; // e.g. 2
};

export function attachPricingSelects(
  qb: SelectQueryBuilder<Ride>,
  { perKm, minFare, minFareKm, roundTo }: PricingParams
) {
  const distExpr = `COALESCE(ride.distance_km::numeric, (ST_Distance(ride.departure_location, ride.arrival_location) / 1000.0)::numeric)`;
  const filledExpr = `LEAST(ride.max_passenger, ride.nb_passenger + 1)`;
  const bonusExpr = `
    CASE
      WHEN ${filledExpr} >= ride.max_passenger THEN 0.15
      WHEN ${filledExpr} >= 3                      THEN 0.10
      WHEN ${filledExpr} >= 2                      THEN 0.05
      ELSE 0
    END
  `;
  const totalExpr = `
    CASE
      WHEN ${distExpr} < :minFareKm::numeric THEN :minFare::numeric
      ELSE ${distExpr} * :perKm::numeric
    END
  `;
  const totalAfterBonusExpr = `(${totalExpr}) * (1 - (${bonusExpr}))`;

  const totalRoundedExpr = `ROUND((${totalAfterBonusExpr})::numeric, :roundTo::int)::float8`;
  const perPassengerExpr = `ROUND(((${totalAfterBonusExpr}) / GREATEST(1, ${filledExpr}))::numeric, :roundTo::int)::float8`;

  return (
    qb
      // 🔑 assure qu’on a l’ID dans le raw pour mapper
      .addSelect(distExpr, "dist_km_calc")
      .addSelect(totalRoundedExpr, "total_route_price")
      .addSelect(perPassengerExpr, "price_per_passenger")
      .setParameters({ perKm, minFare, minFareKm, roundTo })
  );
}

// Hydrate en mappant par ride_id (et pas par index)
export function hydratePricingFromRaw(rides: Ride[], raw: any[]) {
  const byId = new Map<
    number,
    { dist?: number; total?: number; per?: number }
  >();
  for (const r of raw) {
    const id = Number(r.ride_id ?? r.id);
    if (!byId.has(id)) {
      byId.set(id, {
        dist: r.dist_km_calc != null ? Number(r.dist_km_calc) : undefined,
        total:
          r.total_route_price != null ? Number(r.total_route_price) : undefined,
        per:
          r.price_per_passenger != null
            ? Number(r.price_per_passenger)
            : undefined,
      });
    }
  }
  for (const ride of rides) {
    const v = byId.get(ride.id);
    if (!v) continue;
    (ride as any).distance_km = ride.distance_km ?? v.dist;
    (ride as any).total_route_price = v.total;
    (ride as any).price_per_passenger = v.per;
  }
}
