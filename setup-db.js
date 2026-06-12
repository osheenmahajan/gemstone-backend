import dotenv from 'dotenv';
dotenv.config();

import { getSequelize } from './src/config/sequelize.js';
import UserFactory from './src/models/User.js';
import GemstoneFactory from './src/models/Gemstone.js';
import RecommendationFactory from './src/models/Recommendation.js';

const setupDatabase = async () => {
  try {
    const sequelize = getSequelize();

    // Initialize models
    const User = UserFactory(sequelize);
    const Gemstone = GemstoneFactory(sequelize);
    const Recommendation = RecommendationFactory(sequelize);

    // Set up associations
    User.hasMany(Recommendation, { foreignKey: 'userId' });
    Recommendation.belongsTo(User, { foreignKey: 'userId' });

    // Sync models (create tables if they don't exist)
    console.log('Syncing database schema...');
    await sequelize.sync({ force: true });
    console.log('✅ Database schema synced successfully!');

    await sequelize.close();
    console.log('✅ Setup complete!');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

setupDatabase();
