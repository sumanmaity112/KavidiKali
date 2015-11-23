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
