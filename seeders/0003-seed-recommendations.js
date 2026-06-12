'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('recommendations', [
      {
        id: 1,
        userId: 1,
        zodiacSign: 'Libra',
        birthMonth: 10,
        preference: 'love',
        gemstones: [1, 6, 2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 2,
        zodiacSign: 'Aquarius',
        birthMonth: 1,
        preference: 'clarity',
        gemstones: [2, 3, 6],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('recommendations', { id: [1, 2] });
  },
};

