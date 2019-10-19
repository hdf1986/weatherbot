const User = require('./models/user');
const sendMessage = require('./utils/telegram');
const getWeather = require('./utils/openweather');
const messages = {
  rain: 'Hey! Va a llover, lleva paraguas',
  cold: 'Brrrr, va a hacer frio, te abrigaste?',
  hot: 'LLEVATE UN AIRE ACONDICIONADO PEGADO AL CUELLO, HACE CALOR'
}

const howItsToday = (weather) => {
  const todayDate = new Date()
  const today = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`
  const weatherOfToday = weather.list.filter((i) => i.dt_txt.startsWith(today))
  console.log(weatherOfToday)
  if(weatherOfToday.some(w => w[0].main === "rain" || w[0].main === "thunderstorm")) {
    return 'rain'
  } else if(weatherOfToday.some(w => w.main.temp_min < 100)) {
    return 'cold'
  } else {
    return 'hot'
  }
}

User.findAll().then(users => {
  users.forEach(user => {
    console.log(`Saying hi to ${user.id}`)
    if(user.latLon === null) return console.log('No location')

    const [lat, lon] = user.latLon.split(',')
    getWeather({
      lat, lon
    }).then(weather => {
      sendMessage({
        conversationId: user.conversationId,
        text: messages[howItsToday(weather)]
      })
    })
  })
})