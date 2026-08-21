import { Coordinates, KiranaStore } from '../models/types';

export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth radius in km
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

export function findBestKiranaHub(
  destinationCoords: Coordinates,
  pincode: string,
  stores: KiranaStore[]
) {
  const scored = stores.map((store) => {
    const distanceKm = calculateDistance(destinationCoords, {
      latitude: store.latitude,
      longitude: store.longitude,
    });

    const isSamePincode = store.pincode === pincode;
    const capacityPct = Math.round((store.currentCapacity / store.maxCapacity) * 100);
    const hasCapacity = store.currentCapacity < store.maxCapacity;

    let score = distanceKm * 10 + capacityPct / 2 - store.rating * 3;
    if (!isSamePincode) score += 25;
    if (!store.isVerified) score += 9999;
    if (!hasCapacity) score += 9999;

    return {
      store,
      distanceKm,
      isSamePincode,
      capacityPct,
      hasCapacity,
      score,
    };
  });

  return scored.sort((a, b) => a.score - b.score);
}
