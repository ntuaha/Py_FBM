const request = require('request')
const fs = require('fs')
const path = require('path')
const CryptoJS = require('crypto-js')

const FB_API_URL = 'https://graph.facebook.com/v2.10/'
const FBM_API_URL = 'https://graph.facebook.com/v2.10/me/messages'

const pageAccessToken = fs.readFileSync(path.join(__dirname, './TOKEN.txt'), 'utf8')
const clientSecret = fs.readFileSync(path.join(__dirname, '../APP_SECRET.txt'), 'utf8')
const appsecretProof = CryptoJS.HmacSHA256(pageAccessToken, clientSecret).toString(CryptoJS.enc.Hex)

function fromPageToMessenger (pageId, pageUserID, msg) {
  const senderPage = process.env.AHASROBOT_PAGE_ID
  const token = process.env.AHASROBOT_APP_TOKEN
  console.log('token',token)
  let option = {
    url: FB_API_URL + pageUserID,
    qs: {
      access_token: token,
      fields: 'name,age_range,ids_for_apps,ids_for_pages'
    },
    method: 'GET'
  }
  console.log(JSON.stringify(option))
  // 去Facebook 查對應的ID
  return new Promise((resolve, reject) => {
    request(option, (error, response, body) => {
      if (error) {
        return console.err(error)
      }
      let data = JSON.parse(body)
      console.log(body)
      //  透過pageID 去找到顧客對應 page底下的ID     
      let fbmId = ''
      for (let i in data['ids_for_pages']['data']) {
        if (data['ids_for_pages']['data'][i]['page'].id === senderPage) {
          fbmId = data['ids_for_pages']['data'][i].id
          break
        }
      }
      console.log('fbmId', fbmId)
      console.log('pageId', pageId)
      sendText(senderPage, fbmId, msg)
      resolve()
    })
  })
}

async function sendText (sender, recipient, text) {
  let messageData = {'text': text}
  await sendToFacebook(sender, recipient, messageData)
}

// sender 發送者 FROM
// recipient 發送對象 TO
function sendToFacebook (sender, recipient, messageData) {
  return new Promise((resolve, reject) => {
    request({
      url: FBM_API_URL,
      qs: {access_token: process.env.AHASROBOT_PAGE_TOKEN},
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
  sendText: sendText,
  fromPageToMessenger: fromPageToMessenger
}
