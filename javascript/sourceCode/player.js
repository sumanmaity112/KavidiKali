var coin = require('./coin.js').coin;
var Player = function(id, path, coins){
	this.id = id;
	this.matured = false;
	this.chances = 0;
	this.diceValues=[];
	this.coins = coins;
	this.path = path;
};

Player.prototype = {
	rollDice : function(dice){
		var diceValue = dice.roll();
		this.diceValues.push(diceValue);
		this.chances--;
		return diceValue;
	}
// 	moveCoin : function(coinID,movesTo,board){
// 		var coin = this.coins[coinID];
// 		var movesFrom = coin.currentPosition;
// 		coin.move(movesTo,board);
// 		board.isThereAnyCoin(movesTo) && this.kill(board.getCoins(movesTo));
// 		board.addCoin(coin);
// 		board.eraseCoin(movesFrom,coin);
// 	},
// 	kill : function(coin){
// 		coin.die();
// 		this.chances++;
// 		this.matured = true;
// 	},
// 	get path(){
// 		if(this.matured){
// 			var positions=path.generateFullPath(this.startPosition);
// 			positions.map(function(pos){return tiles[pos]});
// 		}
// 		var playerPath = path.generateHalfPath(this.startPosition);
// 		return playerPath.concat(playerPath);
// 	}
};

exports.player = Player;
