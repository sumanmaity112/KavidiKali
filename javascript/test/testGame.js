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
	describe('getAllValidMovesOfCoin',function(){
		it.skip('gives all possible moves of a coin in the given path',function(){
			game.createPlayer('s2');
			coin.currentPosition = '2,0';
			var diceValues = [6,4,2,1];
			assert.deepEqual(board.getAllValidMovesOfCoin(coin,diceValues,path),[ '4,4', '4,2', '4,0', '3,0' ]);
		});
		it.skip('will not give the position as valid if a coin of same player is at the place',function(){
			game.createPlayer('red');
			var diceValues = [6,4,2,1];
			player.moveCoin('orange1','2,0',board);
			player.moveCoin('orange2','4,4',board);
			var coin = player.coins['orange1'];
			assert.deepEqual(board.getAllValidMovesOfCoin(coin,diceValues,path),[ '4,2', '4,0', '3,0' ]);
		});
		it('gives players startPosition if coin is at off Board',function(){
			game.createPlayer('orange');
			var player = game.players['orange'];
			var diceValues = [6];
			assert.deepEqual(game.getAllValidMovesOfCoin(player.coins['orange1'],diceValues,player.path),player.path[0]);	
		});
		it('gives undefined if the player is off board and player doesnt got special value to enter',function(){
			game.createPlayer('orange');
			var player = game.players['orange'];
			var coin = player.coins['orange1'];
			var diceValues = [1,2,3,4,5];
			assert.deepEqual(game.getAllValidMovesOfCoin(coin,diceValues,player.path),undefined);	
		});

	});
	describe('anyMoreMoves',function(){
		it.skip('gives true if the player has more moves available',function(){
			game.createPlayer('red');
			var player = game.players['red'];
			player.diceValues = [1,2,3];
			assert.equal(master.board.anyMoreMoves(player),true);
		});
		it('gives false if the player has no coins on board and hasn\'t got "6"',function(){
			game.createPlayer('red');
			game.players['red'].diceValues = [1,2,3];
			assert.equal(game.anyMoreMoves('red'),false);
		});
		it.skip('gives false if the player has coin at destination and other coin off board',function(){
			var master = new e.GameMaster([6],5,[1,2,3,4,5,6]);
			master.createPlayer('red');
			var player = master.players['red'];
			player.matured = true;
			player.coins['red1'].move('2,2');
			player.diceValues = [1,2,3];
			assert.equal(master.board.anyMoreMoves(player),false);
		});
		it('gives true if the player has coins all off board and got "6" as dice value',function(){
			game.createPlayer('red');
			var player = game.players['red'].diceValues = [6];
			assert.equal(game.anyMoreMoves('red'),true);
		});
	});
});

