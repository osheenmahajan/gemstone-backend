import sequelize from './src/config/sequelize.js';
import { User, Recommendation, Gemstone } from './src/models/index.js';

async function debug() {
  try {
    console.log('\n=== DEBUGGING FK CONSTRAINT ISSUE ===\n');

    // Check users in database
    const users = await User.findAll({ raw: true });
    console.log('📋 Users in database:');
    console.log(JSON.stringify(users, null, 2));
    console.log(`Total users: ${users.length}\n`);

    if (users.length === 0) {
      console.log('❌ No users found! You need to register a user first.\n');
      await sequelize.close();
      return;
    }

    // Show user details
    const user = users[0];
    console.log(`✅ Selected user for testing:`);
    console.log(`  ID: ${user.id} (type: ${typeof user.id})`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}\n`);

    // Check gemstones
    const gemstones = await Gemstone.findAll({ where: { inStock: true }, raw: true });
    console.log(`📦 In-stock gemstones: ${gemstones.length}`);
    if (gemstones.length > 0) {
      console.log(`  First gemstone: ${gemstones[0].name} (ID: ${gemstones[0].id})\n`);
    } else {
      console.log('  ❌ No gemstones available\n');
    }

    // Try to create a recommendation
    console.log('🧪 Attempting to create a test recommendation...\n');
    try {
      const rec = await Recommendation.create({
        userId: user.id,
        zodiacSign: 'Aries',
        birthMonth: 1,
        preference: 'healing',
        gemstones: gemstones.slice(0, 3).map(g => g.id),
      });
      console.log('✅ SUCCESS! Recommendation created:\n', JSON.stringify(rec, null, 2));
    } catch (err) {
      console.log('❌ FAILED to create recommendation:');
      console.log(`  Error name: ${err.name}`);
      console.log(`  Error message: ${err.message}`);
      console.log(`  SQL: ${err.sql || 'N/A'}\n`);
    }

    await sequelize.close();
    console.log('=== END DEBUG ===\n');
  } catch (error) {
    console.error('Debug error:', error);
  }
}

debug();
