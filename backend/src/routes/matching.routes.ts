import { Router } from 'express';
import { rankMatchingStores } from '../controllers/matchingController';

const router = Router();

router.get('/rank', rankMatchingStores);

export default router;
