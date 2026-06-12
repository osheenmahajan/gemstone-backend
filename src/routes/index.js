import { Router } from 'express';

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import gemstoneRoutes from './gemstoneRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import adminRoutes from './adminRoutes.js';
import healthRoute from './healthRoute.js';


const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/gemstones', gemstoneRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/admin', adminRoutes);

// -------------- Health (public) --------------
router.use('/health', healthRoute);

export default router;


