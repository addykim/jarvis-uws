'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
  res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    let sender = event.sender.id
    if (event.message && event.message.text) {
      let text = event.message.text
      if (text == 'hi' || text == 'hello') {
        sendTextMessage(sender, "Hello!")
      } else if (text == 'weather') {
        getWeatherInformation(sender)
      } else if (text == 'subscribe') {
          let messageData = {
            "text":"How frequent should I send you weather updates?",
            "quick_replies": [
              {
                "content_type": "text",
                "title": "1 minute (debugging)",
                "payload": "60"
              },
              {
                "content_type": "text",
                "title": "1 hour",
                "payload": "3600"
              },
              {
                "content_type": "text",
                "title": "4 hours",
                "payload": "14400"
              },
              {
                "content_type": "text",
                "title": "12 hours",
                "payload": "43200"
              },
              {
                "content_type": "text",
                "title": "24 hours",
                "payload": "86400"
              }
            ]
          } 
        sendPayloadMessage(sender, messageData)
      } else if (text == '1 minute (debugging)') {
        sendTextMessage(sender, "I'll send you a message every minute for the next 5 minutes")
        for (let i = 0; i < 5; i++)
          setTimeout(getWeatherInformation(sender), 60000)
      } else {
        sendTextMessage(sender, "Hello! I am currently in test mode. I have no natural language processing at the moment.")
        sendTextMessage(sender, "There are only a few commands I will respond to. Otherwise I will just echo your command.")
        sendTextMessage(sender, "Commands I will respond to are: subscribe, weather, hi, hello.")
      }
    }
    if (event.postback) {
      let text = JSON.stringify(event.postback)
      sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
      continue
    }
  }
  res.sendStatus(200)
})

const token = process.env.PAGE_ACCESS_TOKEN

function sendTextMessage(sender, text) {
  let messageData = { text:text }
  
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

const weather_token = process.env.WEATHER_API

function getWeatherInformation(sender) {
  let weather_api_url = 'http://api.openweathermap.org/data/2.5/weather?q=Austin&APPID=' + weather_token
  let options = {
    url: weather_api_url,
    method: 'GET',
    json: true
  }
  request(weather_api_url, function(error, response, body){
    if (error) 
      console.log(error);
    else {
      let parsed = JSON.parse(body)
      console.log("low " + parsed.main.temp_min)
      console.log("high " + parsed.main.temp_max)
      let report = "Today the temperature will be a low of " + 
          convertKelvinToFarenheit(parsed.main.temp_min) + 
          " and a high of " + 
          convertKelvinToFarenheit(parsed.main.temp_max) + "."
      report = report + " There will be "    
      parsed.weather.forEach(function(weather) {
       console.log(weather);
       report = report + weather.description
      });
      sendTextMessage(sender, report)
    }
  });
}

function convertKelvinToFarenheit(kelvin) {
  return Math.round((kelvin * 9/5 - 459.67) * 10) /10
}

function convertKevlinToCelsius(kelvin) {
  return Math.round((kelvin - 273.15) * 10) / 10
}

function sendPayloadMessage(sender, messageData) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

//launch app 
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})
