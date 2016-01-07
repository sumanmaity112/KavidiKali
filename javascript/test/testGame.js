var Game = require('../sourceCode/game.js');
var sinon = require('sinon');
var assert = require('assert');

var findPlayersCoinDetails = function(coins){
	var coinsDetails={};
	Object.keys(coins).forEach(function(coin){
		coinsDetails[coin] = {'id':coins[coin].id,'currentPosition':coins[coin].currentPosition,
				'reachedDestination' : coins[coin].reachedDestination, 'colour': coins[coin].colour};
	})
	return coinsDetails;
};


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
			game.createPlayer('Ash');
			assert.ok(Object.keys(game.players).length==1);
			assert.equal(0,Object.keys(game.players).indexOf('Ash'))
			game.createPlayer('Dicaprio');
			assert.ok(Object.keys(game.players).length==2);
			assert.equal(1,Object.keys(game.players).indexOf('Dicaprio'))
		});
		it("creates a player with respective path",function(){
			game.createPlayer('suman');
			var playerPathIdGivenByGame = game.players.suman.path.map(function(tile){
				return tile.id;
			});
			var path = ['2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2',
						'0,1','0,0','1,0'];
			assert.deepEqual(playerPathIdGivenByGame,path);
		});
		it("creates multiple players with their respective path",function(){
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
		it('creates a player with respective coins',function(){
			game.createPlayer('suman');
			var coins = {suman1 : { id: 'suman1',currentPosition: -1,reachedDestination: false,colour: 'red'},
						suman2 : { id: 'suman2',currentPosition: -1,reachedDestination: false,colour: 'red'},
						suman3 : { id: 'suman3',currentPosition: -1,reachedDestination: false,colour: 'red'},
						suman4 : { id: 'suman4',currentPosition: -1,reachedDestination: false,colour: 'red'}
					};
			assert.deepEqual(coins,findPlayersCoinDetails(game.players.suman.coins));
		});
		it('creates multiple players with their respective coins',function(){
			game.createPlayer('suman');
			var coins ={suman1 : { id: 'suman1',currentPosition: -1,reachedDestination: false,colour: 'red'},
						suman2 : { id: 'suman2',currentPosition: -1,reachedDestination: false,colour: 'red'},
						suman3 : { id: 'suman3',currentPosition: -1,reachedDestination: false,colour: 'red'},
						suman4 : { id: 'suman4',currentPosition: -1,reachedDestination: false,colour: 'red'}
					};
			assert.deepEqual(coins,findPlayersCoinDetails(game.players.suman.coins));

			game.createPlayer('syani');
			coins = {syani1 : { id: 'syani1',currentPosition: -1,reachedDestination: false,colour: 'green'},
					syani2 : { id: 'syani2',currentPosition: -1,reachedDestination: false,colour: 'green'},
					syani3 : { id: 'syani3',currentPosition: -1,reachedDestination: false,colour: 'green'},
					syani4 : { id: 'syani4',currentPosition: -1,reachedDestination: false,colour: 'green'}
				};
			assert.deepEqual(coins,findPlayersCoinDetails(game.players.syani.coins));
			game.createPlayer('saran');
			coins = {saran1 : { id: 'saran1',currentPosition: -1,reachedDestination: false,colour: 'blue'},
					saran2 : { id: 'saran2',currentPosition: -1,reachedDestination: false,colour: 'blue'},
					saran3 : { id: 'saran3',currentPosition: -1,reachedDestination: false,colour: 'blue'},
					saran4 : { id: 'saran4',currentPosition: -1,reachedDestination: false,colour: 'blue'}
				};
			assert.deepEqual(coins,findPlayersCoinDetails(game.players.saran.coins));
			game.createPlayer('supriya');
			coins = {supriya1 : { id: 'supriya1',currentPosition: -1,reachedDestination: false,colour: 'yellow'},
					supriya2 : { id: 'supriya2',currentPosition: -1,reachedDestination: false,colour: 'yellow'},
					supriya3 : { id: 'supriya3',currentPosition: -1,reachedDestination: false,colour: 'yellow'},
					supriya4 : { id: 'supriya4',currentPosition: -1,reachedDestination: false,colour: 'yellow'}
				};
			assert.deepEqual(coins,findPlayersCoinDetails(game.players.supriya.coins));
		});
	});
		
	describe('setChances',function(){
		it('analyses the given dice value and then gives chance to the given player if dice value is one of special value',function(){
			var dice = {roll:function(){sinon.stub().returns(6)}};
			game.createPlayer('red');
			var player = game.players['red'];
			player.chances = 1;
			player.rollDice(dice);
			assert.equal(player.chances,0);
			game.setChances(6,'red');
			assert.equal(player.chances,1);
		});
		it('analyses the given dice value and then do nothing if dice value is not one of special value',function(){
			var dice = {roll:function(){sinon.stub().returns(6)}};
			game.createPlayer('red');
			var player = game.players['red'];
			player.chances = 1;
			player.rollDice(dice);
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
			var dice = {roll:function(){sinon.stub().returns(6)}};
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
			var dice = {roll:function(){sinon.stub().returns(6)}};
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
		it('gives players startPosition if coin is at off Board',function(){
			game.createPlayer('orange');
			var player = game.players['orange'];
			var diceValues = [6];
			assert.deepEqual(game.getAllValidMovesOfCoin(player.coins['orange1'],diceValues,player.path),[player.path[0].id]);	
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
		it('gives false if the player has no coins on board and hasn\'t got "6"',function(){
			game.createPlayer('red');
			game.players['red'].diceValues = [1,2,3];
			assert.equal(game.anyMoreMoves('red'),false);
		});
		it('gives true if the player has coins all off board and got "6" as dice value',function(){
			game.createPlayer('red');
			var player = game.players['red'].diceValues = [6];
			assert.equal(game.anyMoreMoves('red'),true);
		});
	});
	describe("whenGameOver",function(){
		it("reset the game master when all coins of a player already reached destination",function(){
			game.createPlayer("suman");
			var suman = game.players.suman;
			suman.diceValues.push(1);
			suman.coins.suman1.move("2,2");
			suman.coins.suman2.move("2,2");
			suman.coins.suman3.move("2,2");
			assert.ok(!suman.isWin);
			suman.coins.suman4.move("2,2");
			assert.ok(suman.isWin);
			assert.ok(game.players,{});
		});
		it("sets the game.winner to the current player who won the game",function(){
			game.createPlayer('sooraj');
			game.whenGameOver();
			assert.ok(game.winner=='sooraj');
		});
	});
	describe("reset",function(){
		it("removes all the players and makes a fresh list for players",function(){
			game.createPlayer('sooraj');
			game.createPlayer('suman');
			game.createPlayer('supriya');
			game.createPlayer('saran');
			assert.ok(Object.keys(game.players).length == 4);
			game.reset();
			assert.ok(Object.keys(game.players).length == 0);
		});
	});
});

