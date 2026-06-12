'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
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
        allowNull: true,
      },
      birthMonth: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
      },
      preference: {
        type: Sequelize.ENUM(
          'healing',
          'protection',
          'wealth',
          'love',
          'clarity',
          'energy'
        ),
        allowNull: false,
        defaultValue: 'healing',
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

    await queryInterface.addIndex('users', ['email'], {
      name: 'users_email_unique',
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');

    // Sequelize ENUM cleanup (may require adjustment depending on your Sequelize version)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS users_role_enum;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS users_zodiacSign_enum;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS users_preference_enum;');
  },
};

