const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  dbURL: process.env.DATABASE_URL,
  aiURL: process.env.API_AI,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES
  },
  mail: {
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL,
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASS_MAIL,
    },
  },
  redis: {
    host: process.env.HOST_REDIS,
    port: process.env.PORT_REDIS,
    pass: process.env.PASS_REDIS
  },
  recaptchaSecret: process.env.GG_RECAPTCHA_SECRET,
  secretAPI: process.env.SECRET_API,
  discordWebhook: process.env.DISCORD_WEBHOOK
}
