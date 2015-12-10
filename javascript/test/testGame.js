var Game = require('../sourceCode/game.js').game;
var player = require('../sourceCode/player.js').player;
var Dice = require('../sourceCode/dice.js').dice;

var assert = require('assert');

describe('Game',function(){
	var game;
	beforeEach(function(){
		game = new Game([6],5,[1,2,3,4,5,6]);
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
			assert.ok(game.players['blue'] instanceof player);
		});
		it("creates a player with respective path",function(){
			game.createPlayer('suman');
			var playerPathIdGivenByGame = game.players.suman.path.map(function(tile){
				return tile.id;
			});
			var path = ['2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2',
						'0,1','0,0','1,0'];
			assert.deepEqual(playerPathIdGivenByGame,path);
			game.createPlayer('supriya');
			playerPathIdGivenByGame = game.players.supriya.path.map(function(tile){
				return tile.id;
			});
			path = ['4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2','0,1','0,0','1,0','2,0','3,0',
					'4,0','4,1'];
			assert.deepEqual(playerPathIdGivenByGame,path);
			game.createPlayer('saran');
			playerPathIdGivenByGame = game.players.saran.path.map(function(tile){
				return tile.id;
			});
			path = ['2,4','1,4','0,4','0,3','0,2','0,1','0,0','1,0','2,0','3,0','4,0','4,1','4,2','4,3',
					'4,4','3,4'];
			assert.deepEqual(playerPathIdGivenByGame,path);
			game.createPlayer('syani');
			playerPathIdGivenByGame = game.players.syani.path.map(function(tile){
				return tile.id;
			});
			path = ['0,2','0,1','0,0','1,0','2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4',
					'0,4','0,3'];
			assert.deepEqual(playerPathIdGivenByGame,path);
		});
	});
	describe('setChances',function(){
		it('analyses the given dice value and then gives chance to the given player if dice value is one of special value',function(){
			game.createPlayer('red');
			var player = game.players['red'];
			player.chances = 1;
			player.rollDice(new Dice([1,2,3,4,5,6]));
			assert.equal(player.chances,0);
			game.setChances(6,'red');
			assert.equal(player.chances,1);
		});
		it('analyses the given dice value and then do nothing if dice value is not one of special value',function(){
			game.createPlayer('red');
			var player = game.players['red'];
			player.chances = 1;
			player.rollDice(new Dice([]));
			assert.equal(player.chances,0);
			game.setChances(4,'red');
			assert.equal(player.chances,0);
		});
	});
	describe('stateOfGame',function(){
		it('gives the initial state of the game for a single player',function(){
			game.createPlayer("p1");
			var stateOfGame = game.stateOfGame();
			assert.equal(4,Object.keys(stateOfGame).length);
			assert.equal("red",stateOfGame["p11"].colour);
			assert.equal("red",stateOfGame["p12"].colour);
			assert.equal("red",stateOfGame["p13"].colour);
			assert.equal("red",stateOfGame["p14"].colour);
		});
		it('gives the initial state of the game for multiple players',function(){
			game.createPlayer("p1");
			game.createPlayer("p2");
			game.createPlayer("p3");
			game.createPlayer("p4");
			var stateOfGame=game.stateOfGame();
			assert.equal(16,Object.keys(stateOfGame).length);
			
			assert.equal("red",stateOfGame["p11"].colour);
			assert.equal("red",stateOfGame["p12"].colour);
			assert.equal("red",stateOfGame["p13"].colour);
			assert.equal("red",stateOfGame["p14"].colour);

			assert.equal("green",stateOfGame["p21"].colour);
			assert.equal("green",stateOfGame["p22"].colour);
			assert.equal("green",stateOfGame["p23"].colour);
			assert.equal("green",stateOfGame["p24"].colour);

			assert.equal("blue",stateOfGame["p31"].colour);
			assert.equal("blue",stateOfGame["p32"].colour);
			assert.equal("blue",stateOfGame["p33"].colour);
			assert.equal("blue",stateOfGame["p34"].colour);

			assert.equal("yellow",stateOfGame["p41"].colour);
			assert.equal("yellow",stateOfGame["p42"].colour);
			assert.equal("yellow",stateOfGame["p43"].colour);
			assert.equal("yellow",stateOfGame["p44"].colour);
		});		
	});
	describe('isPlayerMatured',function(){
		it('it checks the players is matured or not',function(){
			game.createPlayer('red');
			game.createPlayer('blue');
			assert.ok(!game.isPlayerMatured(game.players['red']));
			assert.ok(!game.isPlayerMatured(game.players['blue']));
			game.players['red'].matured = true;
			assert.ok(game.isPlayerMatured(game.players['red']));
		});
	});
	describe('currentPlayer',function(){
		it('gives the current player',function(){
			game.createPlayer('red');
			game.createPlayer('yellow');
			game.players['red'].chances++;
			var currPlayer = game.currentPlayer;
			assert.equal(currPlayer,'red');
		});
	});
	describe('nextPlayer',function(){
		it('gives the next player who have chance to play',function(){
			var dice = new Dice([1,2,3,4,5]);
			game.createPlayer('red');
			game.createPlayer('yellow');
			game.players['red'].chances++;
			var currPlayer = game.currentPlayer;
			assert.equal(currPlayer,'red');
			game.players[currPlayer].rollDice(dice);
			assert.equal(game.nextPlayer(),'yellow');
			currPlayer = game.currentPlayer;
			assert.equal(currPlayer,'yellow');
		});
		it('gives the next player a chance to roll dice',function(){
			var dice = new Dice([1,2,3,4,5]);
			game.createPlayer('red');
			game.createPlayer('yellow');
			game.createPlayer('blue');
			game.createPlayer('green');
			game.players['red'].chances++;
			var currPlayer = game.currentPlayer;
			assert.equal(currPlayer,'red');
			game.players[currPlayer].rollDice(dice);
			game.nextPlayer();
			currPlayer = game.currentPlayer;
			assert.equal(currPlayer,'yellow');
			game.players[currPlayer].rollDice(dice);
			game.nextPlayer();
			currPlayer = game.currentPlayer;
			assert.equal(currPlayer,'blue');
			game.players[currPlayer].rollDice(dice);
			game.nextPlayer();
			currPlayer = game.currentPlayer;
			assert.equal(currPlayer,'green');
		});
	});
});

