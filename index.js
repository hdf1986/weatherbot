const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000
const User = require('./models/user');
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN || ''

[User].map(model => model.sync({ force: true }));

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/webhooks/telegram', async (req, res) => {
  console.log(req.body)
  console.log(User, User.createFromRequest)
  const user = await User.createFromRequest(req.body)
  console.log(user)
  
  res.send({ status: "ok" })
})

app.listen(port, () => console.log(`Weatherbot app listening on port ${port}!`))