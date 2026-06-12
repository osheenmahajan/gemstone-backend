import { DataTypes } from 'sequelize';

const UserFactory = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Name is required' },
          len: { args: [1, 100], msg: 'Name must be between 1 and 100 characters' },
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: 'users_email_unique',
        validate: {
          notEmpty: { msg: 'Email is required' },
          isEmail: { msg: 'Email must be a valid email address' },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Password is required' },
        },
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
        validate: {
          isIn: {
            args: [['user', 'admin']],
            msg: 'Role must be either user or admin',
          },
        },
      },
      zodiacSign: {
        type: DataTypes.ENUM(
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
          'Pisces'
        ),
        allowNull: true,
        validate: {
          isIn: {
            args: [
              [
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
              ],
            ],
            msg: 'zodiacSign is invalid',
          },
        },
      },
      birthMonth: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        validate: {
          min: { args: [1], msg: 'Birth month must be 1 or greater' },
          max: { args: [12], msg: 'Birth month must be 12 or less' },
        },
      },
      preference: {
        type: DataTypes.ENUM('healing', 'protection', 'wealth', 'love', 'clarity', 'energy'),
        allowNull: false,
        defaultValue: 'healing',
        validate: {
          isIn: {
            args: [['healing', 'protection', 'wealth', 'love', 'clarity', 'energy']],
            msg: 'Preference is invalid',
          },
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      underscored: false,
    }
  );

  return User;
};

export default UserFactory;

