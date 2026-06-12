import winston from 'winston';
import morgan from 'morgan';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Determine log level based on environment
const getLevel = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
  )
);

// Define where to store/output logs
const transports = [
  // Console logging
  new winston.transports.Console(),
  // Error log file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Combined log file
  new winston.transports.File({ filename: 'logs/combined.log' }),
];

// Create the winston logger instance
export const logger = winston.createLogger({
  level: getLevel(),
  levels,
  format: logFormat,
  transports,
});

// Create a stream object for morgan HTTP logger to pipe messages to winston
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Express middleware for logging requests
export const requestLogger = morgan(
  ':remote-addr - :method :url :status :res[content-length] - :response-time ms',
  { stream }
);
