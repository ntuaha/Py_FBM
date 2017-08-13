const request = require('request')
const fs = require('fs')
const path = require('path')

const TOKEN = fs.readFileSync(path.join(__dirname, 'TOKEN.txt'))
const FB_API_URL = 'https://graph.facebook.com/v2.10/me/messages'

async function sendText (sender, recipient, text) {
  let messageData = {'text': text}
  await sendToFacebook(sender, recipient, messageData)
}

// sender 發送者 FROM
// recipient 發送對象 TO
function sendToFacebook (sender, recipient, messageData) {
  return new Promise((resolve, reject) => {
    request({
      url: FB_API_URL,
      qs: {access_token: TOKEN},
      method: 'POST',
      json: {
        recipient: {id: recipient},
        message: messageData
      }
    }, (error, response, body) => {
      if (error) {
        reject(error)
      } else if (response.body.error) {
        resolve(body)
      }
    })
  })
}

module.exports = {
  sendToFacebook: sendToFacebook,
  sendText: sendText
}
