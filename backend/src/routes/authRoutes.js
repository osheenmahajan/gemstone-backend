import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware.js';
import { register, login, logout } from '../controllers/authController.js';

const router = Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
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
  body('birthMonth').optional().isInt({ min: 1, max: 12 }).withMessage('Birth month must be 1..12'),
  body('preference')
    .optional()
    .isIn(['healing', 'protection', 'wealth', 'love', 'clarity', 'energy'])
    .withMessage('Invalid preference'),
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/logout', logout);

export default router;

