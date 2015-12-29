var Game = require('../sourceCode/game.js');
var Player = require('../sourceCode/player.js');
var Dice = require('../sourceCode/dice.js');
var Coin = require('../sourceCode/coin.js');
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
	});
}); 
