// utils/pricingSql.ts
import { SelectQueryBuilder } from "typeorm";
import { Ride } from "../entities/Ride";

export type PricingParams = {
  perKm: number; // ex: 0.14
  minFare: number; // ex: 2.5
  minFareKm: number; // ex: 10
  roundTo: number; // ex: 2
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

  return qb
    .addSelect(distExpr, "dist_km_calc")
    .addSelect(totalRoundedExpr, "total_route_price")
    .addSelect(perPassengerExpr, "price_per_passenger")
    .setParameters({ perKm, minFare, minFareKm, roundTo });
}

// util à appeler après .getRawAndEntities()
export function hydratePricingFromRaw(rides: Ride[], raw: any[]) {
  rides.forEach((ride, i) => {
    (ride as any).distance_km = ride.distance_km ?? Number(raw[i].dist_km_calc);
    (ride as any).total_route_price = Number(raw[i].total_route_price);
    (ride as any).price_per_passenger = Number(raw[i].price_per_passenger);
  });
}
