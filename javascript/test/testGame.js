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
		it('return truFe when dice value is same as special value',function(){
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
			game.createPlayer('rock');
			var playerPathIdGivenByGame = game.players.rock.path.map(function(tile){
				return tile.id;
			});
			var path = ['2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2',
						'0,1','0,0','1,0'];
			assert.deepEqual(playerPathIdGivenByGame,path);
		});
		it("creates multiple players with their respective path",function(){
			game.createPlayer('rock');
			var playerPathIdGivenByGame = game.players.rock.path.map(function(tile){
				return tile.id;
			});
			var path = ['2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2',
						'0,1','0,0','1,0'];
			assert.deepEqual(playerPathIdGivenByGame,path);
			game.createPlayer('jiya');
			playerPathIdGivenByGame = game.players.jiya.path.map(function(tile){
				return tile.id;
			});
			path = ['4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2','0,1','0,0','1,0','2,0','3,0',
					'4,0','4,1'];
			assert.deepEqual(playerPathIdGivenByGame,path);
			game.createPlayer('peter');
			playerPathIdGivenByGame = game.players.peter.path.map(function(tile){
				return tile.id;
			});
			path = ['2,4','1,4','0,4','0,3','0,2','0,1','0,0','1,0','2,0','3,0','4,0','4,1','4,2','4,3',
					'4,4','3,4'];
			assert.deepEqual(playerPathIdGivenByGame,path);
			game.createPlayer('gwen');
			playerPathIdGivenByGame = game.players.gwen.path.map(function(tile){
				return tile.id;
			});
			path = ['0,2','0,1','0,0','1,0','2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4',
					'0,4','0,3'];
			assert.deepEqual(playerPathIdGivenByGame,path);
		});
		it('creates a player with respective coins',function(){
			game.createPlayer('rock');
			var coins = {rock1 : { id: 'rock1',currentPosition: -1,reachedDestination: false,colour: 'red'},
						rock2 : { id: 'rock2',currentPosition: -1,reachedDestination: false,colour: 'red'},
						rock3 : { id: 'rock3',currentPosition: -1,reachedDestination: false,colour: 'red'},
						rock4 : { id: 'rock4',currentPosition: -1,reachedDestination: false,colour: 'red'}
					};
			assert.deepEqual(coins,findPlayersCoinDetails(game.players.rock.coins));
		});
		it('creates multiple players with their respective coins',function(){
			game.createPlayer('rock');
			var coins ={rock1 : { id: 'rock1',currentPosition: -1,reachedDestination: false,colour: 'red'},
						rock2 : { id: 'rock2',currentPosition: -1,reachedDestination: false,colour: 'red'},
						rock3 : { id: 'rock3',currentPosition: -1,reachedDestination: false,colour: 'red'},
						rock4 : { id: 'rock4',currentPosition: -1,reachedDestination: false,colour: 'red'}
					};
			assert.deepEqual(coins,findPlayersCoinDetails(game.players.rock.coins));

			game.createPlayer('gwen');
			coins = {gwen1 : { id: 'gwen1',currentPosition: -1,reachedDestination: false,colour: 'green'},
					gwen2 : { id: 'gwen2',currentPosition: -1,reachedDestination: false,colour: 'green'},
					gwen3 : { id: 'gwen3',currentPosition: -1,reachedDestination: false,colour: 'green'},
					gwen4 : { id: 'gwen4',currentPosition: -1,reachedDestination: false,colour: 'green'}
				};
			assert.deepEqual(coins,findPlayersCoinDetails(game.players.gwen.coins));
			game.createPlayer('peter');
			coins = {peter1 : { id: 'peter1',currentPosition: -1,reachedDestination: false,colour: 'blue'},
					peter2 : { id: 'peter2',currentPosition: -1,reachedDestination: false,colour: 'blue'},
					peter3 : { id: 'peter3',currentPosition: -1,reachedDestination: false,colour: 'blue'},
					peter4 : { id: 'peter4',currentPosition: -1,reachedDestination: false,colour: 'blue'}
				};
			assert.deepEqual(coins,findPlayersCoinDetails(game.players.peter.coins));
			game.createPlayer('jiya');
			coins = {jiya1 : { id: 'jiya1',currentPosition: -1,reachedDestination: false,colour: 'yellow'},
					jiya2 : { id: 'jiya2',currentPosition: -1,reachedDestination: false,colour: 'yellow'},
					jiya3 : { id: 'jiya3',currentPosition: -1,reachedDestination: false,colour: 'yellow'},
					jiya4 : { id: 'jiya4',currentPosition: -1,reachedDestination: false,colour: 'yellow'}
				};
			assert.deepEqual(coins,findPlayersCoinDetails(game.players.jiya.coins));
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
			var dice = {roll:function(){sinon.stub().returns(4)}};
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
		it("removes the all dice values of current player if current player doesn't have any more moves",function(done){
			this.timeout(3000);
			var dice = {roll:function(){return 2}};
			game.createPlayer('red');
			game.createPlayer('yellow');
			game.createPlayer('blue');
			game.createPlayer('green');
			game.players['red'].chances++;
			game.players['red'].rollDice(dice);
			game.nextPlayer();
			assert.equal(game.currentPlayer,'yellow');
			setTimeout(function(){
				assert.deepEqual(game.players['red'].diceValues,[])	
				done();
			},2500);
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
		it('gives all possible moves of coin if coin is onBoard',function(){
			game.createPlayer('orange');
			var player = game.players['orange'];
			var coin = player.coins['orange1'];
			coin.currentPosition = '2,0';
			var diceValues = [1,2,3];
			assert.deepEqual(game.getAllValidMovesOfCoin(coin,diceValues,player.path),[ '3,0', '4,0', '4,1' ]);
		})
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
			game.createPlayer("rock");
			var rock = game.players.rock;
			rock.diceValues.push(1);
			rock.coins.rock1.move("2,2");
			rock.coins.rock2.move("2,2");
			rock.coins.rock3.move("2,2");
			assert.ok(!rock.isWin);
			rock.coins.rock4.move("2,2");
			assert.ok(rock.isWin);
			assert.ok(game.players,{});
		});
		it("sets the game.winner to the current player who won the game",function(){
			game.createPlayer('john');
			game.whenGameOver();
			assert.ok(game.winner=='john');
		});
	});
	describe("reset",function(){
		it("removes all the players and makes a fresh list for players",function(){
			game.createPlayer('john');
			game.createPlayer('rock');
			game.createPlayer('jiya');
			game.createPlayer('peter');
			assert.ok(Object.keys(game.players).length == 4);
			game.reset();
			assert.ok(Object.keys(game.players).length == 0);
		});
	});
	describe("getNotification",function(){
		it("return notification text ",function(){
			game.notification_text="jp got 2";
			assert.equal(game.getNotification(),'jp got 2');
		});
	});
});

