var tile = require('../sourceCode/tile.js').tile;
var Coin = require('../sourceCode/coin.js').coin;
var game =  require('../sourceCode/game.js').game;
var assert = require('assert');
var ld=require("lodash");

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
	describe("Capture",function(){
		var defaultGame;
		beforeEach(function(){
			defaultGame = new game([6],5,[1,2,3,4,5,6])
		});
		it("resets the killed coin",function(){
			defaultGame.createPlayer("sooraj");
			var sooraj = defaultGame.players.sooraj;
			defaultGame.createPlayer("suman");
			var suman = defaultGame.players.suman;
			var tilesId = '2,1';
			defaultGame.tiles[tilesId].coin=sooraj.coins.sooraj1;
			sooraj.coins.sooraj1.currentPosition = tilesId;
			suman.coins.suman1.currentPosition = tilesId;
			defaultGame.tiles[tilesId].capture(suman.coins.suman1,defaultGame);

			assert.equal(sooraj.coins.sooraj1.currentPosition,-1);
			assert.equal(suman.chances,1)
		});
		it("does not do anything for similar coin",function(){
			defaultGame.createPlayer("suman");
			var suman = defaultGame.players.suman;
			var tilesId = '2,1';
			defaultGame.tiles[tilesId].coin=suman.coins.suman1;
			suman.coins.suman1.currentPosition = tilesId;
			suman.coins.suman2.currentPosition = tilesId;
			defaultGame.tiles[tilesId].capture(suman.coins.suman1,defaultGame);
			
			assert.equal(suman.coins.suman2.currentPosition,tilesId);
			assert.equal(suman.chances,0)
		});
	});
});

describe("Generate Tiles",function(){
	it("should generate all the safe tiles required for a given size",function(){
		var tiles=tile.generateTiles(5);
		var c1=new Coin("p1","red");
		var c2=new Coin("p2","yellow");
		var safePositions=[ '2,0', '4,2', '2,4', '0,2', '2,2' ];
		safePositions.forEach(function(pos){
			tiles[pos].place(c1);
			tiles[pos].place(c2);
			assert.ok(tiles[pos].contains(c1));
			assert.ok(tiles[pos].contains(c2));
		})
	});
	it("should generate all the unsafe tiles required for a given size",function(){
		var tiles=tile.generateTiles(5);
		var c1=new Coin("p1","red");
		var c2=new Coin("p2","yellow");
		var safePositions=['2,0', '4,2', '2,4', '0,2','2,2'];
		assert.equal(25,Object.keys(tiles).length);
		var unsafePositions=ld.difference(Object.keys(tiles),safePositions);
		unsafePositions.forEach(function(pos){
			tiles[pos].place(c1);
			tiles[pos].place(c2);
			assert.ok(!tiles[pos].contains(c1));
			assert.ok(tiles[pos].contains(c2));
		})
	});
});