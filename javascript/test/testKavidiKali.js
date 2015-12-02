var entities = require('./../sourceCode/kavidiKaliLib.js').entities;
var assert = require('assert');

describe("Dice",function(){
	describe('roll', function(){
		it('gives the value that we passed to the dice',function(){
			var dice = new entities.Dice([2]);
			assert.equal(dice.roll(),2);
		});
		it('gives a value randomly picked from the passed values',function(){
			var values = [4,5,1];
			var dice = new entities.Dice(values);
			assert.ok(values.indexOf(dice.roll())!=-1);
		});
	});
});

describe('board',function(){
	it('create a board of given size with given safe places',function(){
		var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
		var board = new entities.Board(safePlaces,5);
		assert.deepEqual(board.safePlaces,safePlaces);
		assert.equal(Object.keys(board.grid).length,5*5);
	});
	describe('isSafe',function(){
		it('returns true if the given position is a safe position',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coinPosition = '2,2';
			assert.ok(board.isSafe(coinPosition)); 
			coinPosition = '0,2';
			assert.ok(board.isSafe(coinPosition));
			coinPosition = '4,2';
			assert.ok(board.isSafe(coinPosition));
		});
		it('returns false if the given position is not a safe position',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coinPosition = '2,3';
			assert.ok(!board.isSafe(coinPosition)); 
			coinPosition = '4,4';
			assert.ok(!board.isSafe(coinPosition));
			coinPosition = '3,4';
			assert.ok(!board.isSafe(coinPosition)); 
		});
	});
	describe('isThereAnyCoin',function(){
		it('checks wheather coin is present on tile',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			board.grid['1,2'] = 1;
			assert.ok(board.isThereAnyCoin(['1,2']))
		});
		it('checks wheather coin is not present on tile',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			assert.ok(!board.isThereAnyCoin(['2,3']));
			assert.ok(!board.isThereAnyCoin(['1,4']));
		});
	});
	it('checks safe place of a board contain array',function(){
		var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
		var board = new entities.Board(safePlaces,5);
		assert.ok(board.grid['0,2'] instanceof Array)
		assert.deepEqual(board.grid['0,2'],[]);
	});
	it('checks tiles except safe place of a board does not contain array',function(){
		var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
		var board = new entities.Board(safePlaces,5);
		assert.ok(!(board.grid['1,2'] instanceof Array))
		assert.notDeepEqual(board.grid['1,2'],[]);
	});
	describe('addCoin',function(){
		it('adds a coin to the board on a specified position other than safe places',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coin = new entities.Coin('red1');
			coin.currentPosition = '0,3';
			board.addCoin(coin);		
			assert.deepEqual(board.grid['0,3'],coin);	
		});
		it('adds a coin to the list of coins on the board on a specified position of safe places',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coin1 = new entities.Coin('red1');
			coin1.currentPosition = '0,2';
			board.addCoin(coin1);
			assert.deepEqual(board.grid['0,2'],[coin1]);	
			var coin2 = new entities.Coin('red2');
			coin2.currentPosition = '0,2';
			board.addCoin(coin2);	
			assert.deepEqual(board.grid['0,2'],[coin1,coin2]);	
		});
	});
	describe('eraseCoin',function(){
		it('erase a coin from the board on a specified position other than safe places',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coin = new entities.Coin('red1');
			coin.currentPosition = '0,3';
			board.eraseCoin(coin);		
			assert.equal(board.grid['0,3'],undefined);	
		});
		it('erase a coin from the list of coins on the board on a specified position of safe places',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coin1 = new entities.Coin('red1');
			var coin2 = new entities.Coin('red2');
			coin1.currentPosition = '0,2';
			coin2.currentPosition = '0,2';
			board.addCoin(coin1);
			board.addCoin(coin2);
			board.eraseCoin('0,2',coin1);	
			assert.deepEqual(board.grid['0,2'],[coin2]);
			board.eraseCoin('0,2',coin2);	
			assert.deepEqual(board.grid['0,2'],[]);	
		});
	});
	describe('getCoins',function(){
		it('gives the coin present in the given position',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coin = new entities.Coin('red1');
			coin.currentPosition = '0,3';
			board.addCoin(coin);
			assert.deepEqual(board.getCoins('0,3'),coin);
		});
		it('gives the list of all coins present in the given position if the position is a safe place',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coin1 = new entities.Coin('red');
			coin1.currentPosition = '0,2';
			board.addCoin(coin1);
			assert.deepEqual(board.getCoins('0,2'),[coin1]);
			var coin2 = new entities.Coin('blue');
			coin2.currentPosition = '0,2';
			board.addCoin(coin2);
			assert.deepEqual(board.getCoins('0,2'),[coin1,coin2]);
		});
	});
	describe('getAllValidMovesOfCoin',function(){
		it('gives all possible moves of a coin in the given path',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coin = new entities.Coin('red1');
			var path =['0,0','1,0','2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2','0,1'];
			coin.currentPosition = '2,0';
			var diceValues = [6,4,2,1];
			assert.deepEqual(board.getAllValidMovesOfCoin(coin,diceValues,path),[ '4,4', '4,2', '4,0', '3,0' ]);
		});
		it('will not give the position as valid if a coin of same player is at the place',function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var player = new entities.Player('orange');
			var path =['0,0','1,0','2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2','0,1'];
			var diceValues = [6,4,2,1];
			player.moveCoin('orange1','2,0',board);
			player.moveCoin('orange2','4,4',board);
			var coin = player.coins['orange1'];
			assert.deepEqual(board.getAllValidMovesOfCoin(coin,diceValues,path),[ '4,2', '4,0', '3,0' ]);
		});
		it('gives players startPosition if coin is at off Board',function(){
			var master =new entities.GameMaster([6],5,[1,2,3,4,5,6]);
			var player = master.createPlayer('red');
			var path =['0,0','1,0','2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2','0,1'];
			var diceValues = [1,2,3,4,5,6];
			assert.deepEqual(master.board.getAllValidMovesOfCoin(master.players['red'].coins['red2'],diceValues,path,[6]),['2,0']);	
		});
		it('gives undefined if the player is off board and player doesnt got special value to enter',function(){
			var master =new entities.GameMaster([6],5,[1,2,3,4,5,6]);
			master.createPlayer('red');
			var coin = master.players['red'].coins['red2'];
			var path =['0,0','1,0','2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2','0,1'];
			var diceValues = [1,2,3,4,5];
			assert.deepEqual(master.board.getAllValidMovesOfCoin(coin,diceValues,path,[6]),undefined);	
		});
	});
});

describe('createSafePlaces',function(){
	it("create all the possible safe place of a given size's board",function(){
		var safePlaces = ['2,0','4,2','2,4','0,2','2,2'];
		assert.deepEqual(safePlaces,entities.createSafePlaces(5));
		var safePlaces = ['3,0', '6,3', '3,6', '0,3', '3,3' ];
		assert.deepEqual(safePlaces, entities.createSafePlaces(7));
	});
});
 
 describe('Coin',function(){
 	it('creates an object with given id and properties currentPosition and reachedHome',function(){
 		var coin = new entities.Coin('green1');
 		assert.equal('green1',coin.id);
 		assert.deepEqual(undefined,coin.currentPosition);
 		assert.equal(false,coin.reachedHome);
 	});
	describe('move',function(){
		it('moves the coin from its current position to the given position',function(){
			var board = new entities.Board(entities.createSafePlaces(5),5);
			var coin = new entities.Coin('red1');
			coin.move([2,3],board);
			assert.deepEqual(coin.currentPosition,[2,3]);
			coin.move([2,2],board);
			assert.deepEqual(coin.currentPosition,[2,2]);
		});
	});
	describe('die',function(){
		it('resets the current position of the coin',function(){
			var coin = new entities.Coin('blue1');
			var board = new entities.Board(entities.createSafePlaces(5),5);
			coin.move([2,3],board);
			assert.deepEqual(coin.currentPosition,[2,3]);
			coin.die();
			assert.equal(coin.currentPosition,undefined);
		});
	});
	describe('hasReachedHome', function(){
		it('sets the reached home property of the coin "true"',function(){
			var coin = new entities.Coin('yellow1');
			assert.equal(false,coin.reachedHome);
			coin.hasReachedHome();
			assert.equal(true,coin.reachedHome);
		});
	});	
});

describe('Player',function(){
	it('creates an object with given id and properties "matured" and "diceValues"', function(){
		var player = new entities.Player('p1');
		assert.equal('p1',player.id);
		assert.deepEqual(false,player.matured);
		assert.deepEqual([],player.diceValues);
	});
	describe('rollDice',function(){
		it('rolls the given dice and adds the values to diceValues',function(){
			var player = new entities.Player('p1');
			var dice = new entities.Dice([2]);
			assert.deepEqual(2,player.rollDice(dice));
			assert.deepEqual(player.diceValues,[2]);
		});
	});
	describe('coins',function(){
		it('has 4 coins with id\'s as player\'s id + coin number',function(){
			var player = new entities.Player('green');
			var coins = Object.keys(player.coins);
			assert.deepEqual(coins,['green1','green2','green3','green4']);
		});
		it('has 4 coins. Each coin is created with Coin',function(){
			var Coin = entities.Coin;
			var player = new entities.Player('green');
			var coins = Object.keys(player.coins);
			coins.forEach(function(coin){
				assert.ok(player.coins[coin] instanceof Coin);
			});
		});
	});
	describe('moveCoin', function(){
		it('moves the selected coin to the given place',function(){
			var board = new entities.Board(['2,3','4,2'],5);
			var player = new entities.Player('red');
			var coin = player.coins['red1'];
			player.moveCoin(coin.id,'3,3',board);
			assert.deepEqual(coin.currentPosition,'3,3');
			player.moveCoin(coin.id,'1,1',board);
			assert.deepEqual(coin.currentPosition,'1,1');
		});
		it('kills the coin present in the position to be moved',function(){
			var board = new entities.Board(['2,3','4,2'],5);
			var player1 = new entities.Player('red');
			var player2 = new entities.Player('blue');
			var movesBy = '2,4';
			player1.moveCoin('red1',movesBy,board);
			assert.equal(board.getCoins(movesBy).id,'red1');
			player2.moveCoin('blue2',movesBy,board);
			assert.equal(board.getCoins(movesBy).id,'blue2');
			assert.ok(player1.coins['red1'].currentPosition == undefined)
		});
		it('it will not kill the coin if the "movedTo" place is a safe place. Instead the coin will be added to the list of coins in that place',function(){
			var board = new entities.Board(['2,3','4,2'],5);
			var player1 = new entities.Player('red');
			var player2 = new entities.Player('blue');
			var movesBy = '2,3';
			player1.moveCoin('red1',movesBy,board);
			assert.deepEqual(board.getCoins(movesBy),[player1.coins['red1']]);
			player2.moveCoin('blue2',movesBy,board);
			assert.deepEqual(board.getCoins(movesBy),[player1.coins['red1'],player2.coins['blue2']]);
		});
	});
	describe('killCoin',function(){
		it('kills the given coin',function(){
			var board = new entities.Board(entities.createSafePlaces(5),5);
			var player1 = new entities.Player('red');
			var coin = new entities.Coin('green1');
			coin.move('0,0',board);
			player1.kill(coin);
			assert.equal(coin.currentPosition,undefined);
		});
		it('sets the matured property of the player "true"', function(){
			var player = new entities.Player('red');
			var coin = new entities.Coin('blue1');
			assert.equal(player.matured,false);
			player.kill(coin);
			assert.equal(player.matured,true);
		});
		it('increments the chance of the player', function(){
			var player = new entities.Player('red');
			var coin = new entities.Coin('blue1');
			assert.equal(player.chances,0);
			player.kill(coin);
			assert.equal(player.chances,1);
		});
	});
	describe('path',function(){
		it('is the path of the player for movement of his coins',function(){
			var player = new entities.Player('red','0,2');
			assert.deepEqual(player.path, [ '0,2', '0,1', '0,0', '1,0', '2,0', '3,0', '4,0', 
											'4,1', '4,2', '4,3', '4,4', '3,4', '2,4', '1,4',
											'0,4', '0,3', '0,2', '0,1', '0,0', '1,0', '2,0',
											'3,0', '4,0', '4,1', '4,2', '4,3', '4,4', '3,4',
											'2,4', '1,4', '0,4', '0,3']);
		});
		it('is the half path of the player if the player is not matured',function(){
			var player = new entities.Player('red','2,4');
			assert.deepEqual(player.path, [ '2,4', '1,4', '0,4', '0,3', '0,2', '0,1', '0,0',
											'1,0', '2,0', '3,0', '4,0', '4,1', '4,2', '4,3',
											'4,4', '3,4', '2,4', '1,4', '0,4', '0,3', '0,2',
											'0,1', '0,0', '1,0', '2,0', '3,0', '4,0', '4,1',
											'4,2', '4,3', '4,4', '3,4' ]);
		});
		it('is the full path of the player if the player is matured',function(){
			var player = new entities.Player('red','0,2');
			player.matured = true;
			assert.deepEqual(player.path, [ '0,2', '0,1', '0,0', '1,0', '2,0', '3,0', '4,0', 
											'4,1', '4,2', '4,3', '4,4', '3,4', '2,4', '1,4',
											'0,4', '0,3', '1,3', '2,3', '3,3', '3,2', '3,1',
											'2,1', '1,1', '1,2', '2,2' ]);
		});
	});
});

describe('GameMaster',function(){
	describe('analyzeDiceValue',function(){
		it('return true when dice value is same as special value',function(){
			var gameMaster = new entities.GameMaster([6]);
			assert.ok(gameMaster.analyzeDiceValue(6));
		});
		it('return false when dice value is not same as special value',function(){
			var gameMaster = new entities.GameMaster([6]);
			assert.ok(!gameMaster.analyzeDiceValue(4));
		});
	});
	describe('createPlayer',function(){
		it('creates a player with given playerId',function(){
			var master = new entities.GameMaster();
			master.createPlayer('red');
			assert.ok(Object.keys(master.players).length==1)
			assert.ok(master.players['red'] instanceof entities.Player);
			master.createPlayer('blue');
			assert.ok(Object.keys(master.players).length==2);
		});
		it('creates a player with given playerId and gives startPosition',function(){
			var master = new entities.GameMaster([6],5,[1,2,3,4,5,6]);
			master.createPlayer('red');
			assert.equal(master.players['red'].startPosition,'2,0');
			master.createPlayer('blue');
			assert.equal(master.players['blue'].startPosition,'4,2');
			master.createPlayer('green');
			assert.equal(master.players['green'].startPosition,'2,4');
			master.createPlayer('yellow');
			assert.equal(master.players['yellow'].startPosition,'0,2');
		});
	});
	describe('setChances',function(){
		it('analyses the given dice value and then gives chance to the given player if dice value is one of special value',function(){
			var master = new entities.GameMaster([6]);
			master.createPlayer('red');
			var player = master.players['red'];
			player.chances = 1;
			player.rollDice(new entities.Dice([]));
			assert.equal(player.chances,0);
			master.setChances(6,'red');
			assert.equal(player.chances,1);
		});
		it('analyses the given dice value and then do nothing if dice value is not one of special value',function(){
			var master = new entities.GameMaster([6]);
			master.createPlayer('red');
			var player = master.players['red'];
			player.chances = 1;
			player.rollDice(new entities.Dice([]));
			assert.equal(player.chances,0);
			master.setChances(4,'red');
			assert.equal(player.chances,0);
		});
	});
	describe('createBoard',function(){
		it('creates a board of given size',function(){
			var size = 5;
			var master = new entities.GameMaster([6],size);
			master.createBoard(size);
			assert.ok(master.board instanceof entities.Board);
		});
	});
	describe('createDice',function(){
		it('creates a dice with given values',function(){
			var size = 5,values=[1,2,3,4,5,6];
			var master = new entities.GameMaster([6],size,values);
			master.createDice(values);
			assert.ok(master.dice instanceof entities.Dice);
		});
	});
	describe('isPlayerMatured',function(){
		it('it checks the players is matured or not',function(){
			var master = new entities.GameMaster([6],5,[1,2,3,4,5,6]);
			master.createPlayer('red');
			master.createPlayer('blue');
			assert.ok(!master.isPlayerMatured(master.players['red']));
			assert.ok(!master.isPlayerMatured(master.players['blue']));
			master.players['red'].matured = true;
			assert.ok(master.isPlayerMatured(master.players['red']));
			master.createPlayer('yellow');
			master.players['red'].chances = 1;
			assert.equal(master.getCurrentPlayer().id,'red');
		});
	});
	describe('getCurrentPlayer',function(){
		it('gives the chance the player if the player has not completed his chances',function(){
			var master = new entities.GameMaster([6],5);
			master.createDice([1,2,3,4,5]);	
			master.createPlayer('red');
			master.createPlayer('yellow');
			master.players['red'].chances++;
			var currPlayer = master.getCurrentPlayer();
			assert.equal(currPlayer.id,'red');
		});
		it('gives the next player if the current player has no further chance to play',function(){
			var master = new entities.GameMaster([6],5,[1,2,3,4,5,6]);
			master.createDice([1,2,3,4,5]);	
			master.createPlayer('red');
			master.createPlayer('yellow');
			master.players['red'].chances++;
			var currPlayer = master.getCurrentPlayer();
			assert.equal(currPlayer.id,'red');
			currPlayer.rollDice(master.dice);
			currPlayer = master.getCurrentPlayer()
			assert.equal(currPlayer.id,'yellow');
		});
		it('gives the next player if the current player has no further chance to play and also gives chance to next player',function(){
			var master = new entities.GameMaster([6],5,[1,2,3,4,5,6]);
			master.createDice([1,2,3,4,5]);	
			master.createPlayer('red');
			master.createPlayer('yellow');
			master.createPlayer('blue');
			master.createPlayer('green');
			master.players['red'].chances++;
			var currPlayer = master.getCurrentPlayer();
			assert.equal(currPlayer.id,'red');
			currPlayer.rollDice(master.dice);
			currPlayer = master.getCurrentPlayer()
			assert.equal(currPlayer.id,'yellow');
			currPlayer.rollDice(master.dice);
			currPlayer = master.getCurrentPlayer()
			assert.equal(currPlayer.id,'blue');
			currPlayer.rollDice(master.dice);
			currPlayer = master.getCurrentPlayer()
			assert.equal(currPlayer.id,'green');
		});
	});
});


