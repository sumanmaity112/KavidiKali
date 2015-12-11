var Coin = require('../sourceCode/coin.js').coin;
var assert = require('assert');

describe("Coin",function(){
	it("equals should equate the same coin",function(){
		var c1=new Coin("p1","red");
		assert.ok(c1.equals(c1));
	});
	it("equals should equate similar coin",function(){
		var c1=new Coin("p1","red");
		var c2=new Coin("p1","red");
		assert.ok(c1.equals(c2));
		
	});
	it("equals should negate coin of different color",function(){
		var c1=new Coin("p1","yellow");
		var c2=new Coin("p1","red");		
		assert.ok(!c1.equals(c2));
	});	
	it("equals should negate coin of different color and player",function(){
		var c1=new Coin("p1","yellow");
		var c2=new Coin("p2","red");		
		assert.ok(!c1.equals(c2));
	});
});