var express = require('express'),  
  bodyParser = require('body-parser'),
  fs = require('fs'),
  requests = require('request'),
  events = require('events');

var SERVER_PORT = process.env.SERVER_PORT
var IS_MASTER = process.env.IS_MASTER
var PROXY_PORT = process.env.PROCESS_PORT
var WYDAY_AUTH_RESPONSE_FILE = process.env.WYDAY_AUTH_RESPONSE_FILE
var TEXT_ENCODING = 'utf8'
var URL_ENDPOINTS = {
  'http://wyday.com/': fs.readFileSync(WYDAY_AUTH_RESPONSE_FILE, 
                                       TEXT_ENCODING),
}

var app = express();
var jsonParser = bodyParser.json();


app.all('*', jsonParser, function (req, res) {
  var request_url = req.url
  var mocked_response = URL_ENDPOINTS[request_url]

  if(mocked_response != null) {
    if(IS_MASTER) {
      // Master worker
      // Request the latest data
      var request = requests(request_url)
      req.pipe(request)
      request.pipe(fs.createWriteStream(WYDAY_AUTH_RESPONSE_FILE))
      request.pipe(res)
    } else {
      // Child workers
      // Send the mocked response
      res.set('Content-Type', 'text/xml');
      return res.send(mocked_response)
    }
  } else {
    // Allow normal requests to pass through
    var request = requests(request_url)
    req.pipe(request)
    request.pipe(req)
  }
})

console.log("SERVER LISTENING ON PORT", SERVER_PORT)
app.listen(SERVER_PORT)