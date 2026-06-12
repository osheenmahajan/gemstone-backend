import { User, Gemstone, Recommendation } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';

const ensureAdmin = (req) => {
  if (req.user?.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }
};

/**
 * GET /api/admin/stats
 * Admin-only
 */
export const getStats = async (req, res, next) => {
  try {
    ensureAdmin(req);

    const [totalUsers, totalGemstones, totalRecommendations] = await Promise.all([
      User.count({ where: { role: 'user' } }),
      Gemstone.count(),
      Recommendation.count(),
    ]);

    const recs = await Recommendation.findAll({
      attributes: ['zodiacSign'],
    });

    const zodiacCounts = recs.reduce((acc, r) => {
      const key = r.zodiacSign;
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const mostPopularZodiac =
      Object.entries(zodiacCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return res.json({
      success: true,
      stats: {
        users: totalUsers,
        gemstones: totalGemstones,
        recommendations: totalRecommendations,
        topZodiac: mostPopularZodiac,

      },

    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 * Admin-only
 */
export const getUsers = async (req, res, next) => {
  try {
    ensureAdmin(req);

    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/users/:id
 * Admin-only
 */
export const deleteUser = async (req, res, next) => {
  try {
    ensureAdmin(req);

    const { id } = req.params;

    if (String(id) === String(req.user?.id)) {
      throw new AppError('Cannot delete your own account', 400);
    }

    const deleted = await User.destroy({ where: { id } });


    if (!deleted) throw new AppError('User not found', 404);

    return res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};


