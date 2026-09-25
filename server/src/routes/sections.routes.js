import { Router } from 'express';
import { getSectionsByPage, getSection, updateSection, deleteSection } from '../controllers/sections.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:pageSlug', getSectionsByPage);
router.get('/:pageSlug/:sectionKey', getSection);
router.put('/:pageSlug/:sectionKey', requireAuth, updateSection);
router.delete('/:pageSlug/:sectionKey', requireAuth, deleteSection);

export default router;
