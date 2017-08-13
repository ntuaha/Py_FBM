const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const logger = require('morgan')
const methodOverride = require('method-override')
const fs = require('fs')
const https = require('https')
const xhub = require('express-x-hub')

const app = express()
app.use(logger('dev'))
app.use(methodOverride())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text({'type': 'text/xml'}))
app.use(bodyParser.text({'type': 'application/xml'}))
app.use(bodyParser.text({'type': 'application/rss+xml'}))

const APP_SECRET = fs.readFileSync(path.join(__dirname, 'APP_SECRET.txt'))
app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET || APP_SECRET }))

app.use('/', require(path.join(__dirname, 'fb')))

const options = {
  'key': fs.readFileSync(path.join('/home/aha/nodejs/', '/ssl/letsencrypt/funny.aha.taipei/privkey.pem')),
  'cert': fs.readFileSync(path.join('/home/aha/nodejs/', '/ssl/letsencrypt/funny.aha.taipei/cert.pem')),
  'ca': fs.readFileSync(path.join('/home/aha/nodejs/', '/ssl/letsencrypt/funny.aha.taipei/chain.pem'))
}

var serverSSL = https.createServer(options, app)
const port = (process.env.PORT || 9453)
serverSSL.listen(port, function () {
  console.log('Https server listening on port %d', port)
})
