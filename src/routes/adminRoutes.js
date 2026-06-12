import { Router } from 'express';

import { protect } from '../middleware/auth.middleware.js';
import { getStats, getUsers, deleteUser } from '../controllers/adminController.js';

const router = Router();

router.get('/stats', protect, getStats);
router.get('/users', protect, getUsers);
router.delete('/users/:id', protect, deleteUser);

export default router;

