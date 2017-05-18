const express = require('express')
const request = require('request')
const router = express.Router()



router.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'funny_aha_taipei_aha_robot_fb') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})





router.post('/webhook', function (req, response) {  
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
});

module.exports = router;