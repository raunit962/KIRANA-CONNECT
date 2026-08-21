import { Coordinates, KiranaStore } from '../types';

/**
 * Calculates Great-Circle distance using Haversine formula (km)
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export interface MatchScoreResult {
  store: KiranaStore;
  distanceKm: number;
  isSamePincode: boolean;
  capacityUtilizationPct: number;
  hasCapacity: boolean;
  score: number;
  matchReason: string;
}

/**
 * Smart Kirana Matching Algorithm:
 * Evaluates candidate Kirana stores based on:
 * 1. Hard filters: Must be verified + Current capacity < Max capacity
 * 2. Proximity: Distance to delivery address
 * 3. Pincode affinity: Boost for matching pincode
 * 4. Load balancing: Preference for stores with more available shelf space
 * 5. High merchant rating
 */
export function findBestKiranaStores(
  destinationCoords: Coordinates,
  pincode: string,
  stores: KiranaStore[]
): MatchScoreResult[] {
  const scored = stores.map((store) => {
    const distanceKm = calculateDistance(destinationCoords, {
      latitude: store.latitude,
      longitude: store.longitude,
    });

    const isSamePincode = store.pincode === pincode;
    const capacityPct = Math.round((store.currentCapacity / store.maxCapacity) * 100);
    const hasCapacity = store.currentCapacity < store.maxCapacity;

    // Score calculation (Lower score = higher preference)
    // Distance weight: 1 km = 10 pts
    // Non-matching pincode penalty = +25 pts
    // Capacity penalty = + (utilization % / 2)
    // Store Rating discount = - (rating * 3)
    let score = distanceKm * 10 + (capacityPct / 2) - (store.rating * 3);
    if (!isSamePincode) score += 25;
    if (!store.isVerified) score += 9999;
    if (!hasCapacity) score += 9999;

    let matchReason = `Within ${distanceKm} km in PIN ${store.pincode}`;
    if (isSamePincode && distanceKm < 1.0) {
      matchReason = `Hyper-local match (${distanceKm} km away) with ${store.maxCapacity - store.currentCapacity} shelf slots open`;
    } else if (hasCapacity) {
      matchReason = `Fast turnaround hub (${distanceKm} km, ⭐ ${store.rating})`;
    } else {
      matchReason = `Capacity Full (${store.currentCapacity}/${store.maxCapacity})`;
    }

    return {
      store,
      distanceKm,
      isSamePincode,
      capacityUtilizationPct: capacityPct,
      hasCapacity,
      score,
      matchReason,
    };
  });

  // Sort by score ascending (lowest score is top recommendation)
  return scored.sort((a, b) => a.score - b.score);
}
