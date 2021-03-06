const express = require('express')
const bodyParser = require('body-parser');
const levenshtein = require('js-levenshtein');
const app = express()
const port = process.env.PORT || 3000
const User = require('./models/user');
const sendMessage = require('./utils/telegram');
const getWeather = require('./utils/openweather');
const locationRequest = 'Me decis mi ubicacion?';
const weatherRequest = 'Me decis el clima?';
const deleteRequest = 'Borra mi usuario';
const startRequest = '/start';

[User].map(model => model.sync({ force: false }));

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/webhooks/telegram', async (req, res) => {
  console.log(req.body)
  const user = (await User.createFromRequest(req.body))[0]
  console.log(user.conversationId)
  if(req.body.message.location) {
    const location = req.body.message.location
    const latLon = `${location.latitude},${location.longitude}`
    user.update({ latLon }).then(() => {
      sendMessage({
        conversationId: user.conversationId,
        text: `Grabe tu ubicacion, gracias! Es ${latLon}`
      })
    })
  } else if (levenshtein(locationRequest, req.body.message.text) <= 5) {
    sendMessage({
      conversationId: user.conversationId,
      text: `Tu ubicacion es ${user.latLon}`
    })
  } else if (levenshtein(weatherRequest, req.body.message.text) <= 5) {
    const [lat, lon] = user.latLon.split(',')
    getWeather({
      lat, lon
    }).then(weather => {
      sendMessage({
        conversationId: user.conversationId,
        text: weather.list.map(w => `- ${w.dt_txt}: ${w.main.temp_min} - ${w.main.temp_max} | ${w.weather[0].main}`).join("\n")
      })
    }) 
  } else if (levenshtein(deleteRequest, req.body.message.text) <= 5) {
    user.destroy().then(weather => {
      sendMessage({
        conversationId: user.conversationId,
        text: `Elimine tu usuario, gracias por todo :)`
      })
    }) 
  } else if (levenshtein(startRequest, req.body.message.text) <= 5) {
    sendMessage({
      conversationId: user.conversationId,
      text: `Bienvenido/a! Entiendo pocas cosas, entre ellas:
        - Me decis mi ubicacion?
        - Me decis el clima?
        - Borra mi usuario
        
      Si me envias tu ubicacion, te voy a enviar el clima de esa zona a las 7am utc-3`
    })
  } else {
    sendMessage({
      conversationId: user.conversationId,
      text: "No te pude entender :cry:"
    })
  }
  res.send({ status: "ok" })
})

app.listen(port, () => console.log(`Weatherbot app listening on port ${port}!`))