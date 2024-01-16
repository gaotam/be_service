const axios = require('axios')
const config = require('../config/config');

const sendMessage = async(errorMsg) => {
  // const body = {
  //   username: "HIT BOT",
  //   avatar_url: "https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/343431541_787273575992880_6950198603748680694_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=qe9IGsWl0ZgAX-pW7D5&_nc_ht=scontent.fhan5-2.fna&oh=00_AfAoGzIyM5Rw2wI8DjNdHnB9mv4Vg9EAEs-tuW7sfu5rOQ&oe=6496C8E0",
  //   content: "❌ ❌ CẢNH BÁO: Server dừng họat động ❌ ❌" + 
  //     ' ```❗Chi tiết lỗi: ' + errorMsg + ' ``` '
  // };

  // await axios.post(config.discordWebhook, body, {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // });
}

module.exports = { sendMessage } 