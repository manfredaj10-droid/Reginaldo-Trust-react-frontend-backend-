import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import pagesRoutes from './pages.routes.js';
import sectionsRoutes from './sections.routes.js';
import initiativesRoutes from './initiatives.routes.js';
import settingsRoutes from './settings.routes.js';
import enquiriesRoutes from './enquiries.routes.js';
import uploadRoutes from './upload.routes.js';
import contactRoutes from './contact.routes.js';
import servicesRoutes from './services.routes.js';
import eventsRoutes from './events.routes.js';
import galleryRoutes from './gallery.routes.js';
import contentRoutes from './content.routes.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Reginaldo Trust API',
    database: 'SQLite (node:sqlite)',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Modular Routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/pages', pagesRoutes);
router.use('/sections', sectionsRoutes);
router.use('/initiatives', initiativesRoutes);
router.use('/settings', settingsRoutes);
router.use('/enquiries', enquiriesRoutes);
router.use('/upload', uploadRoutes);
router.use('/contact', contactRoutes);
router.use('/services', servicesRoutes);
router.use('/events', eventsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/content', contentRoutes);

export default router;
