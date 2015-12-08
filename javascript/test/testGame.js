var gameMaster = require('../sourceCode/game.js').game;
var player = require('../sourceCode/player.js').player;
var dice = require('../sourceCode/dice.js').dice;

var assert = require('assert');

describe('GameMaster',function(){
	var game;
	beforeEach(function(){
		game = new gameMaster([6],5,[1,2,3,4,5,6]);
	});
	describe('analyzeDiceValue',function(){
		it('return true when dice value is same as special value',function(){
			assert.ok(game.analyzeDiceValue(6));
		});
		it('return false when dice value is not same as special value',function(){
			assert.ok(!game.analyzeDiceValue(4));
		});
	});
	describe('createPlayer',function(){
		it('creates a player with given playerId',function(){
			game.createPlayer('red');
			assert.ok(Object.keys(game.players).length==1)
			assert.ok(game.players['red'] instanceof player);
			game.createPlayer('blue');
			assert.ok(Object.keys(game.players).length==2);
		});
	});
	describe('setChances',function(){
		it('analyses the given dice value and then gives chance to the given player if dice value is one of special value',function(){
			game.createPlayer('red');
			var player = game.players['red'];
			player.chances = 1;
			player.rollDice(new dice([1,2,3,4,5,6]));
			assert.equal(player.chances,0);
			game.setChances(6,'red');
			assert.equal(player.chances,1);
		});
		it('analyses the given dice value and then do nothing if dice value is not one of special value',function(){
			game.createPlayer('red');
			var player = game.players['red'];
			player.chances = 1;
			player.rollDice(new dice([]));
			assert.equal(player.chances,0);
			game.setChances(4,'red');
			assert.equal(player.chances,0);
		});
	});
	// describe('stateOfGame',function(){
		// it('gives the initial state of the game for a single player',function(){
			// game.createPlayer("p1");
			// var stateOfGame=game.stateOfGame();
			// assert.equal(4,Object.keys(stateOfGame).length);
			// assert.equal("red",stateOfGame["p11"].colour);
			// assert.equal("red",stateOfGame["p12"].colour);
			// assert.equal("red",stateOfGame["p13"].colour);
			// assert.equal("red",stateOfGame["p14"].colour);
		// });
	// 	it('gives the initial state of the game for multiple players',function(){
	// 		game.createPlayer("p1");
	// 		game.createPlayer("p2");
	// 		game.createPlayer("p3");
	// 		game.createPlayer("p4");
	// 		var stateOfGame=game.stateOfGame();
	// 		assert.equal(16,Object.keys(stateOfGame).length);
			
	// 		assert.equal("red",stateOfGame["p11"].colour);
	// 		assert.equal("red",stateOfGame["p12"].colour);
	// 		assert.equal("red",stateOfGame["p13"].colour);
	// 		assert.equal("red",stateOfGame["p14"].colour);

	// 		assert.equal("green",stateOfGame["p21"].colour);
	// 		assert.equal("green",stateOfGame["p22"].colour);
	// 		assert.equal("green",stateOfGame["p23"].colour);
	// 		assert.equal("green",stateOfGame["p24"].colour);

	// 		assert.equal("blue",stateOfGame["p31"].colour);
	// 		assert.equal("blue",stateOfGame["p32"].colour);
	// 		assert.equal("blue",stateOfGame["p33"].colour);
	// 		assert.equal("blue",stateOfGame["p34"].colour);

	// 		assert.equal("yellow",stateOfGame["p41"].colour);
	// 		assert.equal("yellow",stateOfGame["p42"].colour);
	// 		assert.equal("yellow",stateOfGame["p43"].colour);
	// 		assert.equal("yellow",stateOfGame["p44"].colour);
	// 	});		
	// });
	describe('isPlayerMatured',function(){
		it('it checks the players is matured or not',function(){
			game.createPlayer('red');
			game.createPlayer('blue');
			assert.ok(!game.isPlayerMatured(game.players['red']));
			assert.ok(!game.isPlayerMatured(game.players['blue']));
			game.players['red'].matured = true;
			assert.ok(game.isPlayerMatured(game.players['red']));
			game.createPlayer('yellow');
			game.players['red'].chances = 1;
			assert.equal(game.getCurrentPlayer().id,'red');
		});
	});
	describe('getCurrentPlayer',function(){
		it('gives the chance the player if the player has not completed his chances',function(){
			game.createPlayer('red');
			game.createPlayer('yellow');
			game.players['red'].chances++;
			var currentPlayer = game.getCurrentPlayer();
			assert.equal(currentPlayer.id,'red');
		});
		it('gives the next player if the current player has no further chance to play',function(){
			game.createPlayer('red');
			game.createPlayer('yellow');
			game.players['red'].chances++;
			var currPlayer = game.getCurrentPlayer();
			assert.equal(currPlayer.id,'red');
			currPlayer.rollDice(game.dice);
			currPlayer = game.getCurrentPlayer()
			assert.equal(currPlayer.id,'yellow');
		});
		it('gives the next player if the current player has no further chance to play and also gives chance to next player',function(){
			game.createPlayer('red');
			game.createPlayer('yellow');
			game.createPlayer('blue');
			game.createPlayer('green');
			game.players['red'].chances++;
			var currPlayer = game.getCurrentPlayer();
			assert.equal(currPlayer.id,'red');
			currPlayer.rollDice(game.dice);
			currPlayer = game.getCurrentPlayer()
			assert.equal(currPlayer.id,'yellow');
			currPlayer.rollDice(game.dice);
			currPlayer = game.getCurrentPlayer()
			assert.equal(currPlayer.id,'blue');
			currPlayer.rollDice(game.dice);
			currPlayer = game.getCurrentPlayer()
			assert.equal(currPlayer.id,'green');
		});
	});
});


