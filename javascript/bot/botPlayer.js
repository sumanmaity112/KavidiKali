var http = require('http');
var chance = new require('chance')();
var emitter = new (require('events').EventEmitter)();

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
          'Cookie': cookie,
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    return options;
}

var botPlayer = function(gameId){
  console.log('---- in bot');
  this.name = chance.first();
  this.http = http;
  this.gameId = gameId;
}

botPlayer.prototype = {
  start : function(){
    var self = this;
    var data = querystring.stringify({
          name: 'botPlayer',
          gameId: self.gameId,
          option: 'joinGame'
        });
    var option=createHttpOption('/login','POST',self.name);
    var req = self.http.request(option,function(res){
      console.log(res.statusCode,"*****   ___")
    });
    req.write(data);
    req.end();
  },


}
module.exports = botPlayer;
