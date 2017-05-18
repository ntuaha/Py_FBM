import requests
from flask import Flask,g
from flask import request as req
from flask import jsonify # 提供json 回應的方法
import os
import ssl
import requests


app = Flask(__name__)
with open('./token','r') as f:
    token = f.readlines()[0].replace('\n','')

@app.route("/")
def hello():
    return "Hello World!"

def sendText(sender,recipient, text):
  messageData = {'text':text}
  sendToFacebook(sender,recipient,messageData)


def sendToFacebook(sender,recipient,messageData):
    api_url = 'https://graph.facebook.com/v2.9/me/messages?access_token=%s'%token
    print(api_url)
    headers = {'Content-Type': 'application/json'}
    payload = {
      'recipient': {'id':recipient},
      'message': messageData
    }
    print(payload)
    r = requests.post(api_url,json=payload,headers=headers)
    print(r)
    return True



def run(data):
     print(data)
     messaging_events = data['entry'][0]['messaging']
     for msg in messaging_events:
         sender = msg['sender']['id']
         recipient = msg['recipient']['id']
         if 'message' in msg:
             sendText(recipient,sender,"已經收藏你的連結囉:"+msg['message']['text'])




@app.route('/webhook',methods=['GET', 'POST'])
def handleFB():
  if req.method == 'POST':
    data = req.get_json()
    run(data)
    return 'hi'
  else:
    if req.args.get('hub.verify_token') == 'funny_aha_taipei_aha_robot_fb' :
      return req.args.get('hub.challenge')
    else:
      return 'Error, wrong validation token'



if __name__ == "__main__":
  app.run(debug=True,port=9999)
