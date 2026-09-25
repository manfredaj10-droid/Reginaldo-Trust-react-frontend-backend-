import { Router } from 'express';
import { login, getStats } from '../controllers/admin.controller.js';

const router = Router();

router.post('/login', login);
router.get('/stats', getStats);

export default router;
