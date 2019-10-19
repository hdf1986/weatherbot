const User = require('./models/user');
const sendMessage = require('./utils/telegram');
const getWeather = require('./utils/openweather');

User.findAll().then(users => {
  users.forEach(user => {
    sendMessage({
      conversationId: user.conversationId,
      text: "Hola"
    })
  })
})