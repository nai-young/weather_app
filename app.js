const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const request = require('request')
const app = express()
require('dotenv').config()

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index', { data: null, error: 'Enter a name'})
})
app.post('/', (req, res) => {
  let city = req.body.city
  const key = process.env.API_KEY
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`

  request(url, (error, response, body) => {
    try {
      const data = JSON.parse(body)
      const image = data.weather[0].icon
      const img = `http://openweathermap.org/img/wn/${image}@2x.png`
      res.render('index', { data: data, image: img, error: null })
    } catch(err) {
      res.render('index', { data: null, error: 'Invalid city name'})
    }
  })

})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})