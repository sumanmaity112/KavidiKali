var lib = require('./tile.js');
var tiles = lib.tile;
var generateSafePositions = lib.generateSafePositions;
var pathLib = require('./generatePath.js');
var dice = require('./dice.js').dice;
var player = require('./player.js').player;
var Coin = require('./coin.js').coin;
var ld  =  require('lodash');

var Game = function(specialValues,size,diceValues){
	this.safePositions = generateSafePositions(size);
	this.players = {};
	this.specialValues = specialValues;
	this.tiles = tiles.generateTiles(size);
	this.dice = new dice(diceValues);
	this.nextPlayer = nextPlayer(this);
	
};

Game.prototype = {
	analyzeDiceValue : function(diceValue){
		return (this.specialValues.indexOf(diceValue)>=0);
	},
	createPlayer : function(playerId){
		var playersCount = Object.keys(this.players).length;
		var colorSequence=["red","green","blue","yellow"];
		var startingPosition = this.safePositions[playersCount];
		var tiles = this.tiles;
		var path = pathLib.generateHalfPath(startingPosition).map(function(pos){
			return tiles[pos];
		});
		var coins = createCoins(playerId,4,colorSequence[playersCount]);
		this.players[playerId] = new player(playerId, path, coins);
	},
	setChances : function(diceValue,playerId){
		if(this.analyzeDiceValue(diceValue)){
			this.players[playerId].chances++;
			return true;  
		}
	},
	isPlayerMatured : function(player){
		return player.matured;
	},
	stateOfGame: function() {
		var state={};
		var players=this.players;
		for (var player in players) {
			var coins=players[player].coins
			for (var coin in coins) {
				state[coin]=coins[coin];
			}
		}
		return state;
	},
	get currentPlayer(){
		var players = this.players;
		var currPlayer;
		Object.keys(players).forEach(function(player){
			if(players[player].chances)
				currPlayer = players[player]
		});
		return currPlayer.id;
	},
	getAllValidMovesOfCoin : function(coin,diceValues,path){
		var specialValue = this.specialValues;
		if(coin.currentPosition==-1){
			return ld.intersection(diceValues,specialValue).length && path[0] || undefined;
		}
		else{
			var validMoves = diceValues.map(function(diceValue){
				return getTheValidMove(coin,diceValue,path);
			});
			return ld.pull(validMoves,false);
		}
	},
	anyMoreMoves: function(player){
		var player = this.players[player];
		var getMoves = this.getAllValidMovesOfCoin.bind(this);
		var specialValue = this.specialValues;
		var movesPerCoin = Object.keys(player.coins).map(function(coin){
			return getMoves(player.coins[coin],player.diceValues,player.path,specialValue);
		});
		var totalMoves = ld.flatten(movesPerCoin);
		return !!ld.pull(totalMoves,undefined)[0];
	}
};


var getTheValidMove = function(coin,movesBy,path){
	var coinPos = ld.findIndex(path,{id:coin.currentPosition});
	var nextIndex = coinPos+movesBy;
	if(path[nextIndex].contains(coin))
		return false;
	return path[nextIndex];
};

var nextPlayer = function(master){
	var counter = 0;
	return (function(){
		var players = Object.keys(this.players);
		counter = (counter+1)%players.length;
		this.players[players[counter]].chances++;
		return this.players[players[counter]].id;
	}).bind(master);
};


var createCoins =  function(id,numberOfCoins,colour){
	var coins = new Object;
	for(var count=1; count<=numberOfCoins; count++){
		coins[id+count] = new Coin(id+count,colour);
	}
	return coins;
};

exports.game = Game;