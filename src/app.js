import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { requestLogger } from './middleware/logger.middleware.js';
import { errorHandler, AppError } from './middleware/error.middleware.js';
import baseRouter from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();


// 1. Security Headers Middleware
app.use(helmet());

// 2. Cross-Origin Resource Sharing
app.use(cors());

// 3. Body Parsing Middleware (JSON and URL-encoded)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Request Logging Middleware (Morgan + Winston)
app.use(requestLogger);

// 5. Root route (reduces scary 404 logs)
app.get('/', (req, res) => {
  res.json({
    message: 'Gemstone API is running 🚀',
  });
});

// 6. Mount Base Routes
app.use('/api', baseRouter);

// 7. Catch-all for Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 7. Global Error Handler Middleware
app.use(errorHandler);

export default app;
