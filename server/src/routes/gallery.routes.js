import { Router } from 'express';
import { 
  getGallery, 
  createGalleryItem, 
  updateGalleryItem, 
  deleteGalleryItem,
  getCategories,
  createCategory,
  deleteCategory
} from '../controllers/gallery.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', requireAuth, createCategory);
router.delete('/categories/:id', requireAuth, deleteCategory);

router.get('/', getGallery);
router.post('/', requireAuth, createGalleryItem);
router.put('/:id', requireAuth, updateGalleryItem);
router.delete('/:id', requireAuth, deleteGalleryItem);

export default router;
