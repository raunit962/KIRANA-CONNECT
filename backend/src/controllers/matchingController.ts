import { Request, Response } from 'express';
import { db } from '../data/mockDatabase';
import { findBestKiranaHub } from '../services/matchingEngine';

export const rankMatchingStores = (req: Request, res: Response) => {
  const { latitude, longitude, pincode } = req.query;

  const coords = {
    latitude: parseFloat(latitude as string) || 28.5680,
    longitude: parseFloat(longitude as string) || 77.2435,
  };
  const pin = (pincode as string) || '110024';

  const stores = db.getStores();
  const ranked = findBestKiranaHub(coords, pin, stores);

  res.json({
    success: true,
    count: ranked.length,
    destination: { coords, pincode: pin },
    recommendation: ranked[0] || null,
    candidates: ranked,
  });
};
