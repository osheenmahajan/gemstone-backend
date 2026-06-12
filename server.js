import dotenv from 'dotenv';
import { logger } from './src/middleware/logger.middleware.js';

// 1. Capture Uncaught Exceptions early
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! Shutting down...\nError: ${err.message}\nStack: ${err.stack}`);
  process.exit(1);
});

// 2. Load Environment Variables
dotenv.config();

// 3. Import DB and Express App after env loading
import connectDB from './src/config/db.js';
import app from './src/app.js';

// 4. Connect to DB and Start Listening
const startServer = async () => {
  // Establish connection to MySQL via Sequelize
  await connectDB();


  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    logger.info(
      `Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });

  // 5. Capture Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`UNHANDLED REJECTION! Shutting down gracefully...\nError: ${err.message}\nStack: ${err.stack}`);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
