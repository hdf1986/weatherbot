const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000
const User = require('./models/user');
const sendMessage = require('./utils/telegram');

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
    sendMessage({
      conversationId: user.conversationId,
      text: `Grabe tu ubicacion, gracias! Es ${latLon}`
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