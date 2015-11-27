var lodash = require('lodash');
var entities = {};
exports.entities = entities;
var path = require('./generatePath.js');
//===========================================================================
entities.Board = function(safePlaces,size){
	this.grid = createGrid(safePlaces,size);
	this.safePlaces = safePlaces;
};

entities.Board.prototype={
	isSafe : function(position){
		return (lodash.indexOf(this.safePlaces,position)>=0);
	},
	isThereAnyCoin : function(position){
		return (!this.isSafe(position) && !!this.grid[position]);
	},
	addCoin : function(coin){
		if(this.isSafe(coin.currentPosition)){
			var position = coin.currentPosition;
			this.grid[position].push(coin);
		}
		else
			this.grid[coin.currentPosition] = coin;
	},
	getCoins : function(position){
		return this.grid[position];
	},
	eraseCoin : function(movesFrom,activeCoin){
		if(this.isSafe(movesFrom))
			lodash.remove(this.grid[movesFrom],function(coin){
				return coin.id == activeCoin.id; 
			});
		else
			this.grid[movesFrom]=undefined;
	},
	getAllValidMovesOfCoin : function(coin,diceValues,path,specialValue){
		if(!coin.currentPosition){
			return lodash.intersection(diceValues,specialValue).length && [coin.startPosition] || undefined;
		}
		else{
			var validMoves = diceValues.map(function(diceValue){
				return getTheValidMove.call(this,coin,diceValue,path);
			}.bind(this));
			return lodash.pull(validMoves,false);
		}
	},
};

var getTheValidMove = function(coin,movesBy,path){
	var coinIndex = path.indexOf(coin.currentPosition);
	var nextIndex = coinIndex+movesBy
	if(this.isThereAnyCoin(path[nextIndex]))
		return coin.id.slice(0,-1) != this.getCoins(path[nextIndex]).id.slice(0,-1);
	return path[nextIndex];
};

var createGrid = function(safePlaces,size){
	var grid = {};
	for(var row = 0;row < size;row++)
		for(var column = 0;column < size;column++)
			grid[row+','+column] = undefined;
	safePlaces.forEach(function(safePlace){
		grid[safePlace] = [];
	});
	return grid;
};

entities.Coin = function(id,startPosition){
	this.id = id;
	this.currentPosition = undefined;
	this.reachedHome = false;
	this.startPosition = startPosition;
};

entities.Coin.prototype = {
	move : function(movesTo,board){
		var oldPosition = this.currentPosition;
		this.currentPosition = movesTo;
	},
	die : function(){
		this.currentPosition = undefined;
	},

	hasReachedHome : function(){
		this.reachedHome = true;
	}
};

entities.Player = function(id,startPosition){
	this.id = id;
	this.matured = false;
	this.coins = createCoins(id,4,startPosition);
	this.diceValues = new Array;
	this.chances = 0;
	this.startPosition = startPosition;
};

var createCoins =  function(id,numberOfCoins,startPosition){
	var coins = new Object;
	for(var i=1; i<=numberOfCoins; i++){
		coins[id+i] = new entities.Coin(id+i,startPosition);
	};
	return coins;
};

entities.Player.prototype = {
	rollDice : function(dice){
		var diceValue = dice.roll();
		this.diceValues.push(diceValue);
		this.chances--;
		return diceValue;
	},
	moveCoin : function(coinID,movesTo,board){
		var coin = this.coins[coinID];
		var movesFrom = coin.currentPosition;
		coin.move(movesTo,board);
		board.isThereAnyCoin(movesTo) && this.kill(board.getCoins(movesTo));
		board.addCoin(coin);
		board.eraseCoin(movesFrom,coin);
	},
	kill : function(coin){
		coin.die();
		this.chances++;
		this.matured = true;
	},
	get path(){
		if(this.matured){
			return path.generateFullPath(this.startPosition);
		};
			var playerPath = path.generateHalfPath(this.startPosition);
			return playerPath.concat(playerPath);
	}
};

entities.Dice = function(values){
	this.values = values;
};

entities.Dice.prototype = {
	roll : function(){
		var randomIndex = lodash.random(0,this.values.length-1);
		return this.values[randomIndex];
	}
}

entities.GameMaster = function(specialValues,size,diceValues){
	this.players = {};
	this.specialValues = specialValues;
	this.board = this.createBoard(size);
	this.dice = this.createDice(diceValues);
	this.getCurrentPlayer = getCurrentPlayer(this);
};

entities.GameMaster.prototype = {
	analyzeDiceValue : function(diceValue){
		return (this.specialValues.indexOf(diceValue)>=0);
	},
	createPlayer : function(playerId){
		var playersCount = Object.keys(this.players).length; 
		this.players[playerId] = new entities.Player(playerId,this.board.safePlaces[playersCount]);
	},
	setChances : function(diceValue,playerId){
		if(this.analyzeDiceValue(diceValue))
			this.players[playerId].chances++;  
	},
	createBoard : function(size){
		var safePlaces = entities.createSafePlaces(size);
		return new entities.Board(safePlaces,size);
	},
	createDice : function(values){
		return new entities.Dice(values);
	},
	isPlayerMatured : function(player){
		return player.matured;
	}
};

var getCurrentPlayer = function(master){
	var counter = 0;
	return (function(){
		var players = Object.keys(this.players);
		var currPlayer = this.players[players[counter]]
		if(!currPlayer.chances){
			counter = (counter+1)%players.length;
			this.players[players[counter]].chances++;
	 	};	
		return this.players[players[counter]];
	}).bind(master);
};

entities.createSafePlaces = function(size){
	var safePlaces = [];
	safePlaces.push([Math.floor(size/2),0]);
	safePlaces.push([size-1,Math.floor(size/2)]);
	safePlaces.push([Math.floor(size/2),size-1]);
	safePlaces.push([0,Math.floor(size/2)]);
	safePlaces.push([Math.floor(size/2),Math.floor(size/2)]);
	safePlaces.forEach(function(safePlace,index){
		return safePlaces[index] = safePlace.join();
	});
	return safePlaces;
};













