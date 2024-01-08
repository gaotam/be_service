const config = require('../config/config');
const axios = require('axios');

const verify = async(response) => {
  const res = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret: config.recaptchaSecret,
      response: response,
    },
  })
  return res.data.success
}

module.exports = { verify }