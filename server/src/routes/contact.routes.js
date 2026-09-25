import { Router } from 'express';
import { createContact, getContacts, updateContactStatus, deleteContact } from '../controllers/contact.controller.js';

const router = Router();

router.post('/', createContact);
router.get('/', getContacts);
router.patch('/:id', updateContactStatus);
router.delete('/:id', deleteContact);

export default router;
