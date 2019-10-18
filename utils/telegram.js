const request = require('request-promise');
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN || ''
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}/`
module.exports = ({
  text,
  conversationId
}) => {
  request({
    uri: `${TELEGRAM_API_URL}/sendMessage`,
    qs: {
      text,
      chat_id: conversationId
    }
  }).then(res => JSON.parse(res))
}