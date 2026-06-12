import { Router } from 'express';
import { body } from 'express-validator';

import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { getMe, updateMe } from '../controllers/userController.js';

const router = Router();

const updateMeValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('zodiacSign')
    .optional()
    .isIn([
      'Aries',
      'Taurus',
      'Gemini',
      'Cancer',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
      'Aquarius',
      'Pisces',
    ])
    .withMessage('Invalid zodiac sign'),
  body('birthMonth')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('birthMonth must be an integer between 1 and 12'),
  body('preference')
    .optional()
    .isIn(['healing', 'protection', 'wealth', 'love', 'clarity', 'energy'])
    .withMessage('Invalid preference'),
];

// Mounted at /api/users
router.get('/me', protect, getMe);
router.put('/me', protect, validate(updateMeValidation), updateMe);

export default router;

