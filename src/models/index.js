import connectSequelize from '../config/sequelize.js';

import UserFactory from './User.js';
import GemstoneFactory from './Gemstone.js';
import RecommendationFactory from './Recommendation.js';

const sequelize = connectSequelize();

const User = UserFactory(sequelize);
const Gemstone = GemstoneFactory(sequelize);
const Recommendation = RecommendationFactory(sequelize);

// Associations (per approved schema + MVP)
User.hasMany(Recommendation, { foreignKey: 'userId' });
Recommendation.belongsTo(User, { foreignKey: 'userId' });

// Gemstone.hasMany(Recommendation) is intentionally NOT created because recommendations.gemstones
// is JSON and there is no gemstone_id FK in the approved schema.

export { sequelize, User, Gemstone, Recommendation };

