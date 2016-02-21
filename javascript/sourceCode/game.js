var lib = require('./tile.js');
var tiles = lib.tile;
var generateSafePositions = lib.generateSafePositions;
var pathLib = require('./generatePath.js');
var dice = require('./dice.js');
var player = require('./player.js');
var Coin = require('./coin.js');
var ld  =  require('lodash');

const DICE_VALUES = [1,2,3,4,5,6];
const SIZE_OF_BOARD = 5;
const SPECIAL_VALUES = [6];

var Game = function(id, numberOfPlayers){
	this.id=id;
	this.safePositions = generateSafePositions(SIZE_OF_BOARD);
	this.players = {};
	this.specialValues = SPECIAL_VALUES;
	this.tiles = tiles.generateTiles(SIZE_OF_BOARD);
	this.dice = new dice(DICE_VALUES);
	this.counter = 0;
	this.numberOfPlayers = numberOfPlayers;
	this.winner=undefined;
	this.notification_text="";
	this.resetGame = function(){
		var gotRequestFrom=[];
		return function(userId){
			if(gotRequestFrom.indexOf(userId)==-1){
				gotRequestFrom.push(userId);
			}
			if(gotRequestFrom.length==numberOfPlayers)
				this.reset();
		};
	}();
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
			this.players[playerId].notification_text = playerId +" got an extra chance to roll dice";
			this.players[playerId].emitter.emit("new_notification");
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
			return getMoves(player.coins[coin],player.diceValues,player.path);
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
			setTimeout(function(){
				player.diceValues = [];
			},2000);
			this.counter = (this.counter+1)%players.length;
			this.players[this.currentPlayer].chances++;
		};
		return this.currentPlayer;
	},
	whenGameOver : function(){
		this.winner=this.currentPlayer;
 	},
 	reset : function(){
 		this.readyToRemove=true;
		this.winner=undefined;
 	},
 	createNote:function(){
 		this.notification_text = "<p>"+this.players[this.currentPlayer].notification+"</p>";
 	},
 	getNotification : function(){
 		return this.notification_text;
 	},
 	isFull : function(){
 		console.log('game',Object.keys(this.players).length , this.numberOfPlayers)
 		return Object.keys(this.players).length == this.numberOfPlayers;
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
	// if(nextPos){
		if(nextPos.contains(coin))
			return false;	
		return path[nextIndex].id;
	// }
	// return false;
};	

var createCoins =  function(id,numberOfCoins,colour){
	var coins = new Object;
	for(var count=1; count<=numberOfCoins; count++){
		coins[id+count] = new Coin(id+count,colour);
	}
	return coins;
};

module.exports = Game;