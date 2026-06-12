import { Gemstone } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';
import { Op } from 'sequelize';


/**
 * GET /api/gemstones (?q=)
 * Public
 */
export const getAll = async (req, res, next) => {
  try {
    const { q } = req.query;
    const filter = {};

    if (q) {
      const term = String(q).trim();
      if (term) {
        // MySQL-compatible LIKE search (case-insensitive collation typically handles casing)
        filter[Op.or] = [
          { name: { [Op.like]: `%${term}%` } },
          { description: { [Op.like]: `%${term}%` } },
          { category: { [Op.like]: `%${term}%` } },
          { color: { [Op.like]: `%${term}%` } },
        ];
      }
    }


    // Sequelize: convert Mongo queries to Sequelize findAll.
    const gemstones = await Gemstone.findAll({
      where: filter,
      order: [['name', 'ASC']],
      raw: true,
    });


    return res.json({ success: true, count: gemstones.length, gemstones });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/gemstones/:id
 * Public
 */
export const getOne = async (req, res, next) => {
  try {
    const gem = await Gemstone.findByPk(req.params.id);
    if (!gem) throw new AppError('Gemstone not found', 404);

    return res.json({ success: true, gemstone: gem });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/gemstones
 * Admin-only
 */
export const create = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      color,
      zodiacSigns,
      birthMonths,
      imageUrl,
      price,
      inStock,
    } = req.body;

    if (!name || !description || !category || !color) {
      throw new AppError('name, description, category, color required', 400);
    }

    const gemstone = await Gemstone.create({
      name,
      description,
      category,
      color,
      zodiacSigns: zodiacSigns || [],
      birthMonths: birthMonths || [],
      imageUrl: imageUrl || '',
      price: price ?? 0,
      inStock: inStock !== undefined ? inStock : true,
    });

    return res.status(201).json({ success: true, gemstone });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/gemstones/:id
 * Admin-only
 */
export const update = async (req, res, next) => {
  try {
    const gemstone = await Gemstone.findByPk(req.params.id);
    if (!gemstone) throw new AppError('Gemstone not found', 404);

    // Update & validate using model.set() + save()
    gemstone.set(req.body);
    await gemstone.save({ validate: true });


    return res.json({ success: true, gemstone });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/gemstones/:id
 * Admin-only
 */
export const remove = async (req, res, next) => {
  try {
    const gemstone = await Gemstone.findByPk(req.params.id);
    if (!gemstone) throw new AppError('Gemstone not found', 404);
    await gemstone.destroy();

    return res.json({ success: true, message: 'Gemstone deleted' });
  } catch (error) {
    next(error);
  }
};

