// Sequelize auth module (MVP)
import { User } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';
import { signToken } from '../utils/jwtUtil.js';
import { hashPassword } from '../utils/hashPassword.js';
import { comparePassword } from '../utils/comparePassword.js';

const allowedRoles = ['user', 'admin'];

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, zodiacSign, birthMonth, preference } = req.body;

    if (!name || !email || !password) {
      throw new AppError('name, email, password are required', 400);
    }

    const emailLower = String(email).toLowerCase();

    // Check email uniqueness
    const existing = await User.findOne({ where: { email: emailLower } });
    if (existing) return next(new AppError('Email already registered', 400));

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email: emailLower,
      password: hashedPassword,
      zodiacSign: zodiacSign ?? null,
      birthMonth: birthMonth ?? null,
      preference: preference ?? 'healing',
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        zodiacSign: user.zodiacSign,
        birthMonth: user.birthMonth,
        preference: user.preference,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('email and password are required', 400);
    }

    const emailLower = String(email).toLowerCase();

    const user = await User.findOne({ where: { email: emailLower } });
    if (!user) return next(new AppError('Invalid credentials', 401));

    // Compare entered password with stored hash
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return next(new AppError('Invalid credentials', 401));

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        zodiacSign: user.zodiacSign,
        birthMonth: user.birthMonth,
        preference: user.preference,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    // Stateless JWT logout: client should delete token.
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
};

