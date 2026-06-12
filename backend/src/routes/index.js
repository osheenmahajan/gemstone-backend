import { Router } from 'express';

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import gemstoneRoutes from './gemstoneRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/gemstones', gemstoneRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/admin', adminRoutes);

// -------------- Health (public) --------------
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Gemstone Recommendation App API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

export default router;

