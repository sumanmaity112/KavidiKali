var Coin = require('../sourceCode/coin.js');
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
	describe("kill",function(){
		it("gives instruction to move a coin to -1",function(){
			var c1 = new Coin("p1","blue");
			c1.currentPosition = '2,1';
			c1.kill();
			assert.equal(c1.currentPosition,-1);
		});
	});
	describe("killed",function(){
		it("announces the listeners that it has got killed",function(){
			var listener = {
				killed:false,
				whenCoinKills:function(){this.killed=true}
			};

			var coin = new Coin("p1","blue");

			coin.addListener(listener);
			coin.killed();
			assert.ok(listener.killed);
		});
	});
});