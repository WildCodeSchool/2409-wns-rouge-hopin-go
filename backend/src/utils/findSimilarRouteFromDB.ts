// src/utils/findSimilarRouteFromDB.ts
import { Ride } from "../entities/Ride";

/**
 * Retourne un A→B déjà calculé et très proche géographiquement.
 * - On matche via ST_DWithin (tolérance en mètres) sur départ ET arrivée.
 * - On trie par “somme des distances” aux 2 points (plus pertinent que created_at).
 * - Ne renvoie que si distance/durée/polyline existent.
 */
export async function findSimilarRouteFromDB(
  depLng: number,
  depLat: number,
  arrLng: number,
  arrLat: number,
  tolMeters = 500
): Promise<{
  id: number;
  distance_km: number;
  duration_min: number;
  route_polyline5: string;
} | null> {
  const qb = Ride.createQueryBuilder("ride")
    .where(
      `
      ST_DWithin(
        ride.departure_location,
        ST_SetSRID(ST_MakePoint(:d_lng, :d_lat), 4326)::geography,
        :tol
      )
      `,
      { d_lng: depLng, d_lat: depLat, tol: tolMeters }
    )
    .andWhere(
      `
      ST_DWithin(
        ride.arrival_location,
        ST_SetSRID(ST_MakePoint(:a_lng, :a_lat), 4326)::geography,
        :tol
      )
      `,
      { a_lng: arrLng, a_lat: arrLat, tol: tolMeters }
    )
    .andWhere("ride.distance_km IS NOT NULL")
    .andWhere("ride.duration_min IS NOT NULL")
    .andWhere("ride.route_polyline5 IS NOT NULL")
    // ➜ ordonner par proximité aux 2 points (en mètres)
    .orderBy(
      `
      ST_Distance(
        ride.departure_location,
        ST_SetSRID(ST_MakePoint(:d_lng, :d_lat), 4326)::geography
      ) +
      ST_Distance(
        ride.arrival_location,
        ST_SetSRID(ST_MakePoint(:a_lng, :a_lat), 4326)::geography
      )
      `,
      "ASC"
    )
    .limit(1);

  const hit = await qb.getOne();
  if (
    !hit ||
    hit.distance_km == null ||
    hit.duration_min == null ||
    !hit.route_polyline5
  ) {
    return null;
  }

  return {
    id: hit.id,
    distance_km: hit.distance_km,
    duration_min: hit.duration_min,
    route_polyline5: hit.route_polyline5,
  };
}
