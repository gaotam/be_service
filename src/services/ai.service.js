const axios = require("axios");
const FormData = require('form-data');
const { aiURL } = require("../config/config");

const checkinFace = async(name, imgBuffer) => {
  const formData = new FormData();
  formData.append('img', imgBuffer, {
    filename: name,
    contentType: 'image/png', 
  });

  const response = await axios.post(`${aiURL}/check`, formData, {
    headers: formData.getHeaders(),
  });

  return response.data;
}

module.exports = { checkinFace }