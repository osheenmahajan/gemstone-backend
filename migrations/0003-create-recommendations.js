'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recommendations', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      zodiacSign: {
        type: Sequelize.ENUM(
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
      },
      birthMonth: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      preference: {
        type: Sequelize.ENUM('healing', 'protection', 'wealth', 'love', 'clarity', 'energy'),
        allowNull: false,
      },
      gemstones: {
        type: Sequelize.JSON,
        allowNull: false,
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

    await queryInterface.addIndex('recommendations', ['userId', 'createdAt'], {
      name: 'recommendations_user_createdAt_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recommendations');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS recommendations_zodiacSign_enum;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS recommendations_preference_enum;');
  },
};

