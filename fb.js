const express = require('express')
const path = require('path')
const router = express.Router()
const token = 'funny_aha_taipei_aha_robot_fb'
const fb = require('./modules/fb')

function validation (req, res) {
  if (req.param('hub.mode') === 'subscribe' && req.param('hub.verify_token') === token) {
    res.send(req.param('hub.challenge'))
  } else {
    res.sendStatus(400)
  }
}

router.get('/page/webhook', validation)
router.get('/webhook', validation)

router.post('/page/webhook', async (req, res, next) => {
  console.log(JSON.stringify(req.body))
  let changeEvents = req.body.entry[0].changes  
  for (let i = 0; i < changeEvents.length; i++) {
    let event = changeEvents[i]
    console.log("event", JSON.stringify(event))
  }
  res.sendStatus(200)
})

const default_module = require(path.join(__dirname,'./modules/default'))
// 會不會大量訊息需要使用continue
router.post('/webhook', async (req, res, next) => {
  console.log("msg", JSON.stringify(req.body))
  let changeEvents = req.body.entry[0].changes
  let pageId = req.body.entry[0].id
  if (changeEvents) {
    for (let i = 0; i < changeEvents.length; i++) {
      let event = changeEvents[i]
      fb.fromPageToMessenger(pageId, event.value.sender_id, "你是不是想: " + event.value.message)
      console.log("event", JSON.stringify(event))
    }
    res.sendStatus(200)
    return
  }

  let messagingEvents = req.body.entry[0].messaging
  for (let i = 0; i < messagingEvents.length; i++) {
    let event = req.body.entry[0].messaging[i]
    console.log("event", event)
    default_module.ai(event)
  }
  res.sendStatus(200)

  /*
  request({
    uri:"http://localhost:9999/webhook",
    method:"POST",
    json:true,
    body:req.body
  },(err,res,body)=>{
    if(err){
      return console.log(err);
    }
    console.log("Flask body",body);
    response.sendStatus(200)
  });
  */
})

module.exports = router