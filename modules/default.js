const fb = require('./fb')
const request = require('request')

const ai = (event) => {
  let sender = event.sender.id
  let recipient = event.recipient.id
  // 外部連結帶參數
  if (event.referral) {
    referral(sender, recipient, event.referral)
    return true
  }
  if (event.message) {
    if (event.message.text) {
      let text = event.message.text
      // 對實體小i
      if (text.slice(0, 2) === '小i') {
        request('http://esb-robot.mybluemix.net/ai/NAO?q=' + encodeURIComponent(text.slice(2)), function (error, response, body) {
          if (!error && response.statusCode == 200) {
            fb.sendText(recipient, sender, body)
          }
        })
        return true
      }
      // ask esuncat
      request('http://funny.aha.taipei/esb/ai/1/message/' + encodeURIComponent(text), (error, response, body) => {
        if (!error && response.statusCode === 200) {
          let data = JSON.parse(body)
          if (data.answerMsg != undefined) {
            let msg = data.answerMsg[0]
            let regEx = /<[^>]*>/g
            msg = msg.replace(regEx, '')
            msg = msg.replace('玉山喵管家', 'aha')
            fb.sendText(recipient, sender, msg)
          }
        }
      })
      return true
    }
  }
}
// http://m.me/437575193035602?ref=aha|http://www.google.com.tw|user_post,email
function referral (sender, recipient, referral) {
  var lists = referral.ref.split('|')
  fb.sendText(recipient, sender, 'FB ID: ' + lists[0])
  fb.sendText(recipient, sender, 'FB MSG ID: ' + sender)
  fb.sendText(recipient, sender, 'LINK: ' + lists[1])
  fb.sendText(recipient, sender, 'PERMISSION: ' + lists[2])
}

module.exports = {
  ai: ai
}
