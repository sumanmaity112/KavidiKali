var EventEmitter = require('events').EventEmitter;
var rEmitter = new EventEmitter();

exports.main = function(instruction, req, res, gameMaster){
	rEmitter.emit(instruction, req, res, gameMaster);
};

rEmitter.on('rollDice',function(req, res, gameMaster){
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		var obj = JSON.parse(data);
		var userId = obj.player.trim()
		var player = gameMaster.players[userId];
		var diceValue = player.rollDice(gameMaster.dice);
		console.log(diceValue+' ===== '+ req.headers.cookie);
		res.statusCode = 200;
		res.end('diceValues='+diceValue);
	});
});
