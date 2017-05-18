const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const logger = require('morgan')
const methodOverride = require('method-override')
const fb = require('./fb')

const app = express()

app.use(logger('dev'))
app.use(methodOverride())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({"type":"text/xml"}));
app.use(bodyParser.text({"type":"application/xml"}));
app.use(bodyParser.text({"type":"application/rss+xml"}));


app.use('/',fb)

const https = require('https')
const fs = require("fs")
const options = {
    "key": fs.readFileSync(path.join('/home/aha/nodejs/','/ssl/letsencrypt/funny.aha.taipei/privkey.pem')),
    "cert": fs.readFileSync(path.join('/home/aha/nodejs/','/ssl/letsencrypt/funny.aha.taipei/cert.pem')),
    "ca": fs.readFileSync(path.join('/home/aha/nodejs/','/ssl/letsencrypt/funny.aha.taipei/chain.pem'))    
};

var server_ssl = https.createServer(options, app);
server_ssl.listen(9453, function () {
    console.log('Https server listening on port ' + 9453);
});