import { Router } from 'express';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from '../controllers/enquiries.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getEnquiries);
router.patch('/:id/status', requireAuth, updateEnquiryStatus);
router.delete('/:id', requireAuth, deleteEnquiry);

export default router;
