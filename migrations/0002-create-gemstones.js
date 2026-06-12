'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gemstones', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      zodiacSigns: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      birthMonths: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM('healing', 'protection', 'wealth', 'love', 'clarity', 'energy'),
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: '',
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      inStock: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('gemstones', ['inStock', 'category'], {
      name: 'gemstones_inStock_category_idx',
    });

    await queryInterface.addIndex('gemstones', ['category'], {
      name: 'gemstones_category_idx',
    });

    await queryInterface.addIndex('gemstones', ['name'], {
      name: 'gemstones_name_unique',
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gemstones');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS gemstones_category_enum;');
  },
};

