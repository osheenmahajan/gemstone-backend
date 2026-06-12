import { DataTypes } from 'sequelize';

const RecommendationFactory = (sequelize) => {
  const Recommendation = sequelize.define(
    'Recommendation',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        validate: {
          isNumeric: { msg: 'userId must be a number' },
          min: { args: [1], msg: 'userId must be positive' },
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
        allowNull: false,
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
        allowNull: false,
        validate: {
          min: { args: [1], msg: 'Birth month must be 1 or greater' },
          max: { args: [12], msg: 'Birth month must be 12 or less' },
        },
      },
      purpose: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'purpose is required' },
        },
      },
      gemstones: {
        // JSON array of gemstone ids recommended
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          isValidNonEmptyJsonArray(value) {
            if (value === null || value === undefined) {
              throw new Error('gemstones is required');
            }
            if (!Array.isArray(value)) {
              throw new Error('gemstones must be a JSON array');
            }
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
      tableName: 'recommendations',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      indexes: [
        {
          name: 'recommendations_user_createdAt_idx',
          fields: ['userId', 'createdAt'],
        },
      ],
    }
  );

  return Recommendation;
};

export default RecommendationFactory;

