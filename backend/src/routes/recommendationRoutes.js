import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { recommend, latestHistory, history, remove } from '../controllers/recommendationController.js';

const router = Router();

const recommendValidation = [
  body('zodiacSign')
    .optional()
    .trim()
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
    .withMessage('Invalid zodiacSign'),
  body('zodiac_sign')
    .optional()
    .trim()
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
    .withMessage('Invalid zodiac_sign'),
  body('birthMonth')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('birthMonth must be between 1 and 12'),
  body('birth_month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('birth_month must be between 1 and 12'),
  body('preference')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Invalid preference'),
  body('purpose')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Invalid purpose'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be between 1 and 50'),
];

/**
 * @route POST /api/recommendations/recommend
 * @desc  Get gemstone recommendations based on zodiac/birthMonth/preference
 * @access Private
 */
router.post('/recommend', protect, validate(recommendValidation), recommend);

/**
 * @route GET /api/recommendations/history/latest
 * @desc  Get the latest recommendation history for the logged-in user
 * @access Private
 */
router.get('/history/latest', protect, latestHistory);

/**
 * @route GET /api/recommendations/history
 * @desc  Get all recommendation history for the logged-in user
 * @access Private
 */
router.get('/history', protect, history);

/**
 * @route DELETE /api/recommendations/:id
 * @desc  Delete a recommendation belonging to the current user
 * @access Private
 */
router.delete('/:id', protect, remove);

export default router;



