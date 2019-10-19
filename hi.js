const User = require('./models/user');
const sendMessage = require('./utils/telegram');
const getWeather = require('./utils/openweather');

const howItsToday = (weather) => {
  const todayDate = new Date()
  const today = `${todayDate.getFullYear()}-${todayDate.getMonth()}-${todayDate.getDate()}`
  const weatherOfToday = weather.list.map(w => w.dt_txt)
                                     .filter((i) => i.startsWith(today))
  console.log(weatherOfToday)
}

User.findAll().then(users => {
  users.forEach(user => {
    console.log(`Saying hi to ${user.id}`)
    if(user.latLon === null) return console.log('No location')

    const [lat, lon] = user.latLon.split(',')
    getWeather({
      lat, lon
    }).then(() => howItsToday(weather))
    sendMessage({
      conversationId: user.conversationId,
      text: "Hola"
    })
  })
})