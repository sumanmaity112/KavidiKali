var coin = require('./coin.js').coin;
var ld = require('lodash');

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
	},
	moveCoin : function(coinID,movesTo){
		var coin = this.coins[coinID];
		if(coin.currentPosition==-1){
			if(this.path[0].id == movesTo && this.diceValues.indexOf(6)>=0){
				this.path[0].place(coin);
				coin.move(movesTo);
				this.diceValues = removeValue(this.diceValues, 6);
			};
		}
		else{
			var currTileIndex = ld.findIndex(this.path,{id:coin.currentPosition});
			var nextTileIndex = ld.findIndex(this.path,{id:movesTo});
			var dice = nextTileIndex - currTileIndex;
			if(this.diceValues.indexOf(dice)>=0){
				coin.move(movesTo);
				this.path[nextTileIndex].place(coin);
				this.diceValues = removeValue(this.diceValues, dice);
				this.path[currTileIndex].removeCoin(coin);
			};
		};
	}
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

var removeValue = function(list,value){
	var index = list.indexOf(value);
	return list.filter(function(value,ind){
		return ind!=index;
	});
};
