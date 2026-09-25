import { Router } from 'express';
import {
  getCatalog,
  createCatalogService,
  updateCatalogService,
  deleteCatalogService,
  createServiceRequest,
  getServiceRequests
} from '../controllers/services.controller.js';

const router = Router();

// Catalog CRUD
router.get('/catalog', getCatalog);
router.post('/catalog', createCatalogService);
router.put('/catalog/:id', updateCatalogService);
router.delete('/catalog/:id', deleteCatalogService);

// Citizen Emergency Assistance Requests
router.post('/request', createServiceRequest);
router.get('/requests', getServiceRequests);

export default router;
