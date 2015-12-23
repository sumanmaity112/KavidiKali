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
	this.counter = 0;
	this.winner=undefined;
};

Game.prototype = {
	analyzeDiceValue : function(diceValue){
		return (this.specialValues.indexOf(diceValue)>=0);
	},
	createPlayer : function(playerId){
		var playersCount = Object.keys(this.players).length;
		var colorSequence=["red","green","blue","yellow"];
		var startingPosition = this.safePositions[playersCount];
		var path = createPath(startingPosition,this.tiles,pathLib.generateHalfPath);
		var extendedPath  = createPath(startingPosition,this.tiles,pathLib.generateExtendedPath);
		var coins = createCoins(playerId,4,colorSequence[playersCount]);
		var newPlayer = new player(playerId, path, coins,extendedPath);
		Object.keys(coins).forEach(function(coinId){
			var coin=newPlayer.coins[coinId];
			coin.addListener(newPlayer);
		});
		newPlayer.addListener(this);
		this.players[playerId]=newPlayer;
	},
	setChances : function(diceValue,playerId){
		if(this.analyzeDiceValue(diceValue)){
			this.players[playerId].chances++;
			return true;  
		};
		return false;
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
			};
		};
		return state;
	},
	get currentPlayer(){
		var players = Object.keys(this.players);
		return players[this.counter]
	},
	getAllValidMovesOfCoin : function(coin,diceValues,path){
		var specialValue = this.specialValues;
		if(coin){
			if(coin.currentPosition==-1){
				getTheValidMove(coin,diceValues[0],path)
				return ld.intersection(diceValues,specialValue).length && [path[0].id] || undefined;
			}
			else{
				var validMoves = diceValues.map(function(diceValue){
					return getTheValidMove(coin,diceValue,path);
				});
				return ld.pull(validMoves,false);
			}	
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
	},
	anyMoreChances:function(player){
		return this.players[player].chances;
	},
	nextPlayer : function(master){
		var players = Object.keys(this.players);
		if(!this.anyMoreMoves(this.currentPlayer) && !this.anyMoreChances(this.currentPlayer)){
			var player = this.players[this.currentPlayer];
			player.diceValues = [];
			this.counter = (this.counter+1)%players.length;
			this.players[this.currentPlayer].chances++;
		};
		return this.currentPlayer;
	},
	whenGameOver : function(){
		console.log('________________________________________________________________');
		console.log('Ohhhh Game Over ',this.currentPlayer,' Is win');
		console.log('________________________________________________________________');
		this.winner=this.currentPlayer;
 	},
 	reset : function(){
 		console.log('GAME SUCESSFULLY RESET');
 		this.players={};
		this.counter=0;
		this.winner=undefined;
 	}
};

var createPath = function(startingPosition,tiles,operationName){
	return operationName(startingPosition).map(function(pos){
		return tiles[pos];
	});
};

var getTheValidMove = function(coin,movesBy,path){
	var coinPos = ld.findIndex(path,{id:coin.currentPosition});
	var nextIndex = coinPos+movesBy;
	if(nextIndex >= path.length && path.length==16)
		nextIndex = nextIndex%path.length;
	var nextPos = path[nextIndex];
	if(nextPos){
		if(nextPos.contains(coin))
			return false;	
		return path[nextIndex].id;
	}
	return false;
};	

var createCoins =  function(id,numberOfCoins,colour){
	var coins = new Object;
	for(var count=1; count<=numberOfCoins; count++){
		coins[id+count] = new Coin(id+count,colour);
	}
	return coins;
};

exports.game = Game;