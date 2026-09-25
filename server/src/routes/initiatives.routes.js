import { Router } from 'express';
import { getInitiatives, createInitiative, updateInitiative, deleteInitiative } from '../controllers/initiatives.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getInitiatives);
router.post('/', requireAuth, createInitiative);
router.put('/:id', requireAuth, updateInitiative);
router.delete('/:id', requireAuth, deleteInitiative);

export default router;
