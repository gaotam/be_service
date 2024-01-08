const logger = require('../config/logger');

const connection = (socket) => {
  logger.info("Connected socket", { label: "socket.io" })
  socket.on('disconnect', () => {
    logger.info(`User disconnect id is ${socket.id}`, { label: "socket.io" })
  })
}

module.exports = { connection }