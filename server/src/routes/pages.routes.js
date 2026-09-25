import { Router } from 'express';
import { getPages, getPageBySlug, updatePageSEO } from '../controllers/pages.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getPages);
router.get('/:slug', getPageBySlug);
router.put('/:slug/seo', requireAuth, updatePageSEO);

export default router;
