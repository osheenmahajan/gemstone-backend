'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Aisha Khan',
        email: 'aisha@example.com',
        // Replace these placeholder bcrypt hashes with real ones if needed
        password: '$2a$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        role: 'user',
        zodiacSign: 'Libra',
        birthMonth: 10,
        preference: 'love',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Noah Patel',
        email: 'noah@example.com',
        password: '$2a$10$bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        role: 'admin',
        zodiacSign: 'Aquarius',
        birthMonth: 1,
        preference: 'clarity',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { id: [1, 2] });
  },
};

