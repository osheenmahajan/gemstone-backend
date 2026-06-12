import { DataTypes } from 'sequelize';

const GemstoneFactory = (sequelize) => {
  const Gemstone = sequelize.define(
    'Gemstone',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: 'gemstones_name_unique',
        validate: {
          notEmpty: { msg: 'Gemstone name is required' },
          len: { args: [1, 120], msg: 'Gemstone name must be between 1 and 120 characters' },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Gemstone description is required' },
        },
      },
      zodiacSigns: {
        // Stored as JSON in MySQL
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          isValidJson(value) {
            if (value === null || value === undefined) {
              throw new Error('zodiacSigns is required');
            }
          },
        },
      },
      birthMonths: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          isValidJson(value) {
            if (value === null || value === undefined) {
              throw new Error('birthMonths is required');
            }
          },
        },
      },
      category: {
        type: DataTypes.ENUM('healing', 'protection', 'wealth', 'love', 'clarity', 'energy', 'success', 'health'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['healing', 'protection', 'wealth', 'love', 'clarity', 'energy', 'success', 'health']],
            msg: 'Category is invalid',
          },
        },
      },
      color: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Gemstone color is required' },
          len: { args: [1, 80], msg: 'Gemstone color must be between 1 and 80 characters' },
        },
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: '',
        validate: {
          len: { args: [0, 500], msg: 'imageUrl must be 500 characters or less' },
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          min: { args: [0], msg: 'Price cannot be negative' },
        },
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'INR',
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: {
          min: { args: [0], msg: 'Stock cannot be negative' },
        },
      },
      buyLink: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: '',
        validate: {
          len: { args: [0, 500], msg: 'buyLink must be 500 characters or less' },
        },
      },
      benefits: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: '',
        validate: {
          len: { args: [0, 500], msg: 'benefits must be 500 characters or less' },
        },
      },
      inStock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      tableName: 'gemstones',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  return Gemstone;
};

export default GemstoneFactory;

