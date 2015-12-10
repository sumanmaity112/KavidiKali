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

	// describe('moveCoin',function(){
	// 	it.skip('moves the selected coin to the given place',function(){
	// 		var board = new Board(['2,3','4,2'],5);
	// 		var player = new Player('red');
	// 		var coin = player.coins['red1'];
	// 		player.moveCoin(coin.id,'3,3',board);
	// 		assert.deepEqual(coin.currentPosition,'3,3');
	// 		player.moveCoin(coin.id,'1,1',board);
	// 		assert.deepEqual(coin.currentPosition,'1,1');
			
	// 	});
	// 	it.skip('kills the coin present in the position to be moved',function(){
	// 		var board = new Board(['2,3','4,2'],5);
	// 		var player1 = new Player('red');
	// 		var player2 = new Player('blue');
	// 		var movesBy = '2,4';
	// 		player1.moveCoin('red1',movesBy,board);
	// 		assert.equal(board.getCoins(movesBy).id,'red1');
	// 		player2.moveCoin('blue2',movesBy,board);
	// 		assert.equal(board.getCoins(movesBy).id,'blue2');
	// 		assert.ok(player1.coins['red1'].currentPosition == undefined)
	// 	});
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
	// });
});