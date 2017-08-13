const express = require('express')
const path = require('path')
const router = express.Router()
const token = 'funny_aha_taipei_aha_robot_fb'

router.get('/webhook', function (req, res) {
  if (req.param('hub.mode') === 'subscribe' && req.param('hub.verify_token') === token) {
    res.send(req.param('hub.challenge'))
  } else {
    res.sendStatus(400)
  }
})

const default_module = require(path.join(__dirname,'./modules/default'))
// 會不會大量訊息需要使用continue
router.post('/webhook', async (req, res, next) => {  
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    console.log("event",event)
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