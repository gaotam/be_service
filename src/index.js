const app = require('./app');
const prisma = require('./client');
const config = require('./config/config');
const logger = require('./config/logger');
const discord = require('./utils/discord')

let server;
prisma.$connect().then(() => {
  logger.info('Connected to SQL Database', { data: "hoangdz"} );
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  discord.sendMessage(error.message)
  .then(() => {})
  .catch((error) => {
    logger.error(error);
  })
  .finally(() => {
    exitHandler()
  })
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  discord.sendMessage('SIGTERM received').then(() => {})
  .catch((error) => {
    logger.error(error);
  })
  .finally(() => {
    if (server) {
      server.close();
    }
  })
});