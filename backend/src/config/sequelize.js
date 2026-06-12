import { Sequelize } from 'sequelize';

import { env, assertRequiredMySqlEnv } from './config.js';

let sequelizeInstance;

/**
 * Singleton Sequelize instance (MySQL only)
 */
export const getSequelize = () => {
  if (sequelizeInstance) return sequelizeInstance;

  assertRequiredMySqlEnv();

  sequelizeInstance = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      // Required for some MySQL-compatible providers (e.g., TiDB Serverless)
      // that prohibit insecure transport.
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      freezeTableName: true,
      timestamps: true,
    },
  });

  return sequelizeInstance;
};

export default getSequelize;

