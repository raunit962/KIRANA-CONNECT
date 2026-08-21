import { Router } from 'express';
import {
  getAllParcels,
  getParcelByTracking,
  createParcel,
  dropParcelAtKirana,
  verifyAndReleaseParcel,
} from '../controllers/parcelController';

const router = Router();

router.get('/', getAllParcels);
router.get('/:trackingNumber', getParcelByTracking);
router.post('/dispatch', createParcel);
router.post('/drop', dropParcelAtKirana);
router.post('/verify', verifyAndReleaseParcel);

export default router;
