import { Router } from 'express';
import { body } from 'express-validator';

import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';


import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from '../controllers/gemstoneController.js';

const router = Router();

// Public
router.get('/', getAll);
router.get('/:id', getOne);

const adminValidation = [
  body('name').notEmpty().withMessage('name is required'),
  body('description').notEmpty().withMessage('description is required'),
  body('category')
    .notEmpty()
    .withMessage('category is required')
    .isIn(['healing', 'protection', 'wealth', 'love', 'clarity', 'energy']),
  body('color').notEmpty().withMessage('color is required'),
  body('birthMonths').optional().isArray().withMessage('birthMonths must be an array'),
  body('birthMonths.*')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('birthMonths values must be integers 1-12'),
];

// Admin-only
router.post('/', protect, restrictTo('admin'), validate(adminValidation), create);
router.put('/:id', protect, restrictTo('admin'), validate(adminValidation), update);
router.delete('/:id', protect, restrictTo('admin'), remove);

export default router;

