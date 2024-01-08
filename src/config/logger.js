const { createLogger, format, transports } = require('winston');
const { combine, colorize, timestamp, label, printf, splat } = format;
require('winston-daily-rotate-file');

const config = require('./config');

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    const stack = info.stack.split('\n').slice(0, 3);
    info = {...info, message: stack}
  }
  return info;
});

const formatLog = printf(({ level, message, label, timestamp }) => {
  return `[ ${timestamp} ] [ ${label} ] [ ${level} ] : ${message}`;
});

const fileTransport = new transports.DailyRotateFile({
  level: 'info',
  filename: './logs/log_%DATE%.log',
  datePattern: 'DD_MM_YYYY',
  zippedArchive: true,
  maxSize: '100m',
  maxFiles: '14d'
});


const logger = createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: format.combine(
    label({ label: 'common' }),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss' }),
    enumerateErrorFormat(),
    splat(),
    formatLog
  ),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
      format: combine(
        colorize(),
        formatLog
      )
    }),
    // new transports.File({ filename: './logs/hit.log' }),
    fileTransport
  ],
});

module.exports = logger;
