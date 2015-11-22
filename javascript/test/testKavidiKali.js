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
		var safePlaces = [[0,2],[2,4],[4,2],[2,0],[2,2]];
		var board = new entities.Board(safePlaces,5);
		assert.deepEqual(board.safePlaces,safePlaces);
		assert.equal(board.grid.length , 5);
	});
	it("say that one coin is in safe place when coin's current place is one of the safe places",function(){
		var safePlaces = [[0,2],[2,4],[4,2],[2,0],[2,2]];
		var board = new entities.Board(safePlaces,5);
		var coin={currentPosition:[2,2]};
		assert.ok(board.isSafe(coin)); 
	});
	it("say that one coin is not in safe place when coin's current place is not one of the safe places",function(){
		var safePlaces = [[0,2],[2,4],[4,2],[2,0],[2,2]];
		var board = new entities.Board(safePlaces,5);
		var coin={currentPosition:[2,3]};
		assert.ok(!board.isSafe(coin)); 
	});
})
 