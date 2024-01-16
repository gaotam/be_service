const { PrismaClient } = require('@prisma/client');
const config = require('./config/config');
const logger = require('./config/logger');

const prisma = global.prisma || new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    }
  ],
});

// if (process.env.NODE_ENV === 'development') {
//   global.prisma = prisma;
//   prisma.$on('query', (e) => {
//     logger.info(`Query: ${e.query}\nParams: ${e.params}\nDuration: ${e.duration}ms`, { label: 'prisma' })
//   })
// };

module.exports = prisma;
