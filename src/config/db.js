import { getSequelize } from './sequelize.js';

const connectDB = async () => {
  try {
    const sequelize = getSequelize();

    await sequelize.authenticate();

    console.log('✅ MySQL Connected Successfully');

    return sequelize;
  } catch (error) {
    console.error('❌ MySQL Connection Failed');
    console.error(error);

    process.exit(1);
  }
};

export default connectDB;