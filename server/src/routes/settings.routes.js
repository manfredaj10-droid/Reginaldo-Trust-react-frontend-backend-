import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getSettings);
router.put('/', requireAuth, updateSettings);

export default router;
