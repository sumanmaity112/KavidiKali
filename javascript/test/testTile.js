var tile = require('../sourceCode/tile.js').tile;
var Coin = require('../sourceCode/coin.js').coin;
var assert = require('assert');

describe("Safe Tile",function(){
	it("should be able to hold a coin of a player",function(){
		var safeTile=new tile.SafeTile("0,0");
		var coin=new Coin();
		safeTile.place(coin);
		assert.ok(safeTile.contains(coin));
	});
});