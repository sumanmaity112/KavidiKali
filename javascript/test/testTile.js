var tile = require('../sourceCode/tile.js').tile;
var Coin = require('../sourceCode/coin.js').coin;
var assert = require('assert');

describe("Safe Tile",function(){
	it("should be able to answer if it holds a specific coin",function(){
		var safeTile=new tile.SafeTile("0,0");
		var coin=new Coin("p1","red");
		safeTile.place(coin);
		assert.ok(safeTile.contains(coin));
	});
	it("should be able to answer if it does not hold a specific coin",function(){
		var safeTile=new tile.SafeTile("0,0");
		var coin=new Coin("p1","red");
		var aDifferentCoin=new Coin("p2","blue");
		safeTile.place(coin);
		assert.ok(!safeTile.contains(aDifferentCoin));
		
	});
});

describe("Unsafe Tile",function(){
	it("should be able to hold a coin of a player",function(){
		var unsafeTile=new tile.UnsafeTile("0,0");
		var coin=new Coin();
		unsafeTile.place(coin);
		assert.ok(unsafeTile.contains(coin));
	});
});

describe("Generate Tiles",function(){
	it("should generate all the safe tiles required for a given size",function(){
		var tiles=tile.generateTiles(5);
		var c1=new Coin("p1","red");
		var c2=new Coin("p2","yellow");
		tiles["0,2"].place(c1);
		tiles["0,2"].place(c2);
		assert.ok(tiles["0,2"].contains(c1));
		assert.ok(tiles["0,2"].contains(c2));
		/* Position(0,2)
	Position(2,4)
	Position(4,2)
	Position(2,0)
	Position(2,2)
	*/
	});
});