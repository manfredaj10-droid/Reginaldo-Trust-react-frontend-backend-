import { Router } from 'express';
import { getAllContent, getContentBySection, updateContentSection } from '../controllers/content.controller.js';

const router = Router();

router.get('/', getAllContent);
router.get('/:section', getContentBySection);
router.put('/:section', updateContentSection);

export default router;
