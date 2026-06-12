import { AppError } from '../middleware/error.middleware.js';
import { User } from '../models/index.js';

/**
 * GET /api/users/me
 * Auth: protect
 */
export const getMe = async (req, res, next) => {
  try {
    if (!req.user?.id) throw new AppError('Unauthorized', 401);

    // req.user was attached by auth middleware (id/email/role)
    // We return it as-is (no password leakage).
    return res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/me
 * Auth: protect
 * Allowed fields: name, zodiacSign, birthMonth, preference
 */
export const updateMe = async (req, res, next) => {
  try {
    if (!req.user?.id) throw new AppError('Unauthorized', 401);

    const allowed = ['name', 'zodiacSign', 'birthMonth', 'preference'];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError('No valid fields provided for update', 400);
    }

    const [rowsUpdated] = await User.update(updates, {
      where: { id: req.user.id },
      returning: true,
      validate: true,
    });

    if (rowsUpdated === 0) throw new AppError('User not found', 404);

    const updated = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    return res.json({ success: true, user: updated });
  } catch (error) {
    next(error);
  }
};

