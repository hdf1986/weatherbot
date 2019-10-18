const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000
const User = require('./models/user');

[User].map(model => model.sync({ force: false }));

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/webhooks/telegram', async (req, res) => {
  console.log(req.body)
  const user = await User.createFromRequest(req.body)
  sendMessage({
    conversationId: user.conversationId,
    text: "Hola, soy un bot, teneme paciencia, todavia no naci"
  })
  res.send({ status: "ok" })
})

app.listen(port, () => console.log(`Weatherbot app listening on port ${port}!`))