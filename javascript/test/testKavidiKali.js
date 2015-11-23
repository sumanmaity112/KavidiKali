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
		it("say that one coin is in safe place when coin's current place is one of the safe places",function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coin={currentPosition:'2,4'};
			assert.ok(board.isSafe(coin)); 
		});	
		it("say that one coin is in safe place when coin's current place is one of the safe places",function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coin={currentPosition:'2,2'};
			assert.ok(board.isSafe(coin)); 
			coin = {currentPosition:'0,2'};
			assert.ok(board.isSafe(coin));
			coin = {currentPosition:'4,2'};
			assert.ok(board.isSafe(coin));
		});
		it("say that one coin is not in safe place when coin's current place is not one of the safe places",function(){
			var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
			var board = new entities.Board(safePlaces,5);
			var coin={currentPosition:'2,3'};
			assert.ok(!board.isSafe(coin)); 
			coin = {currentPosition:'4,4'};
			assert.ok(!board.isSafe(coin));
			coin = {currentPosition:'3,4'};
			assert.ok(!board.isSafe(coin)); 
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
	})
	it('checks safe place of a board contain array',function(){
		var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
		var board = new entities.Board(safePlaces,5);
		assert.ok(board.grid['0,2'] instanceof Object)
		assert.deepEqual(board.grid['0,2'],{red:[],blue:[],green:[],yellow:[]});
	});
	it('checks tiles except safe place of a board does not contain array',function(){
		var safePlaces = ['0,2','2,4','4,2','2,0','2,2'];
		var board = new entities.Board(safePlaces,5);
		assert.ok(!(board.grid['1,2'] instanceof Object))
		assert.notDeepEqual(board.grid['1,2'],{red:[],blue:[],green:[],yellow:[]});
	});
});

describe('createSafePlaces',function(){
	it("create all the possible safe place of a given size's board",function(){
		var safePlaces = ['0,2', '2,4', '4,2', '2,0', '2,2'];
		assert.deepEqual(safePlaces,entities.createSafePlaces(5));
		var safePlaces = ['0,3', '3,6', '6,3', '3,0', '3,3'];
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
			var coin = new entities.Coin('red1');
			coin.move([2,3]);
			assert.deepEqual(coin.currentPosition,[2,3]);
			coin.move([2,2])
			assert.deepEqual(coin.currentPosition,[2,2]);
		});
	});
	describe('die',function(){
		it('resets the current position of the coin',function(){
			var coin = new entities.Coin('blue1');
			coin.move([2,3]);
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
			var player = new entities.Player('red');
			var coin = player.coins['red1'];
			player.moveCoin(coin.id,[3,3]);
			assert.deepEqual(coin.currentPosition,[3,3]);
			player.moveCoin(coin.id,[1,1]);
			assert.deepEqual(coin.currentPosition,[1,1]);
		});
	});
});


