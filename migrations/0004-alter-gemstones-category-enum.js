'use strict';

/**
 * Migration: Alter gemstones.category ENUM to add 'success' and 'health' values.
 * MySQL requires modifying the ENUM definition directly via raw SQL.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE \`gemstones\` MODIFY COLUMN \`category\` ENUM('healing','protection','wealth','love','clarity','energy','success','health') NOT NULL;`
    );
    console.log("✅ gemstones.category ENUM extended with 'success' and 'health'");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE \`gemstones\` MODIFY COLUMN \`category\` ENUM('healing','protection','wealth','love','clarity','energy') NOT NULL;`
    );
  },
};
