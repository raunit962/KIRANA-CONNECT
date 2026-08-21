import { Router } from 'express';
import {
  getAllStores,
  getStoreById,
  createStore,
  withdrawUpiEarnings,
} from '../controllers/storeController';

const router = Router();

router.get('/', getAllStores);
router.get('/:id', getStoreById);
router.post('/onboard', createStore);
router.post('/withdraw', withdrawUpiEarnings);

export default router;
