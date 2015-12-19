var Game = require('../sourceCode/game.js').game;
var Player = require('../sourceCode/player.js').player;
var Dice = require('../sourceCode/dice.js').dice;
var Coin = require('../sourceCode/coin.js').coin;
var assert = require('assert');

describe('Player',function(){
	it('creates an object with given id and properties "matured" and "diceValues"', function(){
		var player = new Player('p1');
		assert.equal('p1',player.id);
		assert.equal(false,player.matured);
	});
	describe('rollDice',function(){
		it('rolls the given dice and adds the values to diceValues',function(){
			var player = new Player('p1');
			var dice = new Dice([2]);
			assert.deepEqual(2,player.rollDice(dice));
			assert.deepEqual(player.diceValues,[2]);
		});
	});

	describe('moveCoin',function(){
		it('moves the selected coin to home if coin is off-Board and player has six on dice',function(){
			var game = new Game([6],5,[1,2,3,4,5,6])
			var dice = new Dice([6]);
			game.createPlayer('red');
			var player = game.players['red'];
			player.rollDice(dice);
			var coin = player.coins['red1'];
			player.moveCoin('red1',player.path[0].id);
			assert.deepEqual(coin.currentPosition,player.path[0].id);
		});
		it('moves the selected coin to the given place',function(){
			var game = new Game([6],5,[1,2,3,4,5,6])
			var dice = new Dice([6]);
			game.createPlayer('red');
			var player = game.players['red'];
			player.rollDice(dice);
			var coin = player.coins['red1'];
			player.moveCoin('red1',player.path[0].id);
			assert.deepEqual(coin.currentPosition,player.path[0].id);
			var dice1 = new Dice([2]);
			player.rollDice(dice1);
			player.moveCoin('red1','4,0');
			assert.deepEqual(coin.currentPosition,player.path[2].id);
		});
		it('doesn\'t moves the selected coin to the unvalid position',function(){
			var game = new Game([6],5,[1,2,3,4,5,6])
			var dice = new Dice([6]);
			game.createPlayer('red');
			var player = game.players['red'];
			player.rollDice(dice);
			var coin = player.coins['red1'];
			player.moveCoin('red1',player.path[0].id);
			assert.deepEqual(coin.currentPosition,player.path[0].id);
			var dice1 = new Dice([2]);
			player.rollDice(dice1);
			player.moveCoin('red1','4,2');
			assert.deepEqual(coin.currentPosition,player.path[0].id);
		});
		//it('kills the coin present in the position to be moved',function(){
			//var game = new Game([6],5,[1,2,3,4,5,6]);
			
			// var player1 = new Player('red');
			// var player2 = new Player('blue');
			// var movesBy = '2,4';
			// player1.moveCoin('red1',movesBy,board);
			// assert.equal(board.getCoins(movesBy).id,'red1');
			// player2.moveCoin('blue2',movesBy,board);
			// assert.equal(board.getCoins(movesBy).id,'blue2');
			// assert.ok(player1.coins['red1'].currentPosition == undefined)
		//});
	// 	it.skip('it will not kill the coin if the "movedTo" place is a safe plac Instead the coin will be added to the list of coins in that place',function(){
	// 		var board = new Board(['2,3','4,2'],5);
	// 		var player1 = new Player('red');
	// 		var player2 = new Player('blue');
	// 		var movesBy = '2,3';
	// 		player1.moveCoin('red1',movesBy,board);
	// 		assert.deepEqual(board.getCoins(movesBy),[player1.coins['red1']]);
	// 		player2.moveCoin('blue2',movesBy,board);
	// 		assert.deepEqual(board.getCoins(movesBy),[player1.coins['red1'],player2.coins['blue2']]);
	// 	});
	});
}); 
