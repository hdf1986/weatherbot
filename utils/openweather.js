const request = require('request-promise');
const OPENWEATHER_API_TOKEN = process.env.OPENWEATHER_API_TOKEN || ''
const OPENWEATHER_API_URL = `https://api.openweathermap.org/data/2.5`
module.exports = ({
  lat, lon
}) => {
  request({
    url: `${OPENWEATHER_API_URL}/forecast`,
    qs: {
      lat,
      lon
    }
  }).then(res => JSON.parse(res))
}