var Dice = require('../sourceCode/dice.js');
var assert = require('assert');

describe("Dice",function(){
	describe('roll', function(){
		it('gives the value that we passed to the dice',function(){
			var dice = new Dice([2]);
			assert.equal(dice.roll(),2);
		});
		it('gives a value randomly picked from the passed values',function(){
			var values = [4,5,1];
			var dice = new Dice(values);
			assert.ok(values.indexOf(dice.roll())!=-1);
		});
	});
});