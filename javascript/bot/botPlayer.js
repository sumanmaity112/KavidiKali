var http = require('http');
var chance = new require('chance')();
var EventEmitter = require('events').EventEmitter;

const HOST = process.env.BOT_HOST || 'localhost';
const PORT = process.env.BOT_PORT || 8080;
var querystring = require('querystring');

var createHttpOption = function(url,method,cookie){
  var options = {
      hostname: HOST,
      port: PORT,
      path: url,
      method: method,
      headers: {
          'cookie': cookie,
          'content-type': 'application/x-www-form-urlencoded'
      }
    };
    return options;
}

var botPlayer = function(gameId){
  var self = this;
  this.name = chance.first();
  this.http = http;
  this.gameId = gameId;
  this.cookie = createCookie(this.name,gameId);
  this.timer = setInterval(function(){
                  console.log("Hey i am   ");
                  botManager(self);
               },1000);
  this.emitter = new EventEmitter();
}

botPlayer.prototype = {
  start : function(){
    var self = this;
    var data = querystring.stringify({
          name: self.name,
          gameId: self.gameId,
          option: 'joinGame'
        });
    var option=createHttpOption('/login','POST',self.cookie);
    var req = self.http.request(option,function(res){
    });
    req.write(data);
    req.end();

    self.emitter.addListener('rollDice',function(){
      rollDice(self);
    });

    self.emitter.addListener('moveCoin',function(){
      moveCoin(self);
    });
  }
}

var rollDice = function(self){
  var option=createHttpOption('/instruction?action=rollDice','GET',self.cookie);
  var req = self.http.get(option,function(res){
    moveCoin(self);
  });
}

var moveCoin = function(self){
  var option=createHttpOption('/instruction?action=moveCoin','GET',self.cookie);
  var req = self.http.get(option,function(res){
    console.log("yeah!!!!!!!!!!i came here");
  });
}

var botManager = function(self){
  var option = createHttpOption('/enquiry?question=currentPlayer','GET',self.cookie);
  self.http.get(option,function(res){
    res.on('data',function(chunk){
      if(chunk.toString() == self.name){
        self.emitter.emit('rollDice');
        var playerChance = createHttpOption('/enquiry?question=anyMoreChances','GET',self.cookie);
        self.http.get(playerChance,function(res){
          res.on('data',function(chunk){
            console.log("=========chances",chunk.toString());
            if(chunk.toString()=='true')
              self.emitter.emit('moveCoin');
          });
        });
      }
    });
  });
}

var createCookie = function(userId,gameId){
  return "userId="+userId+"; gameId="+gameId;
}
module.exports = botPlayer;
