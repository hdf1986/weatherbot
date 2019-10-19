const User = require('./models/user');
const sendMessage = require('./utils/telegram');
const getWeather = require('./utils/openweather');

const howItsToday = (weather) => {
  const todayDate = new Date()
  const today = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`
  const weatherOfToday = weather.list.filter((i) => i.dt_txt.startsWith(today))

  if(weatherOfToday.includes(w => w[0].main === "rain" || w[0].main === "thunderstorm")) {
    return 'rain'
  } else if(weatherOfToday.includes(w => w.main.temp_min < 30)) {
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
    }).then(weather => console.log(howItsToday(weather)))
    sendMessage({
      conversationId: user.conversationId,
      text: "Hola"
    })
  })
})