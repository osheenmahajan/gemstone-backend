import { Sequelize } from "sequelize";
import { env, assertRequiredMySqlEnv } from "./config.js";

let sequelizeInstance;

/**
 * Singleton Sequelize instance (MySQL / TiDB Serverless)
 */
export const getSequelize = () => {
  if (sequelizeInstance) return sequelizeInstance;

  assertRequiredMySqlEnv();

  sequelizeInstance = new Sequelize(
    env.DB_NAME,
    env.DB_USER,
    env.DB_PASSWORD,
    {
      host: env.DB_HOST,
      port: Number(env.DB_PORT), // IMPORTANT FIX
      dialect: "mysql",
      logging: false,

      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },

      // ✅ REQUIRED FOR TiDB SERVERLESS (SSL FIX)
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        connectTimeout: 60000,
      },

      define: {
        freezeTableName: true,
        timestamps: true,
      },
    }
  );

  return sequelizeInstance;
};

export default getSequelize;