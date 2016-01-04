var tile = require('../sourceCode/tile.js').tile;
var Coin = require('../sourceCode/coin.js');
var game =  require('../sourceCode/game.js');
var assert = require('assert');
var ld=require("lodash");

describe("Safe Tile",function(){
	it("should be able to answer if it holds a specific coin",function(){
		var safeTile=new tile.SafeTile("0,0");
		var coin={p1:{currentPosition:'2,0'},move:function(movesTo){
			coin['p1'].currentPosition = movesTo;
		}};
		safeTile.place(coin);
		assert.ok(safeTile.contains(coin));
	});
	it("should be able to answer if it does not hold a specific coin",function(){
		var safeTile=new tile.SafeTile("0,0");
		var coin={p1:{currentPosition:'2,0'},move:function(movesTo){
			coin['p1'].currentPosition = movesTo;
		}};
		var aDifferentCoin={p1:{currentPosition:'2,0'},move:function(movesTo){
			aDifferentCoin['p1'].currentPosition = movesTo;
		}};
		safeTile.place(coin);
		assert.ok(!safeTile.contains(aDifferentCoin));
		
	});
});

describe("Unsafe Tile",function(){
	it("should be able to hold a coin of a player",function(){
		var unsafeTile=new tile.UnsafeTile("0,0");
		var coin={color:'red',currentPosition:'2,1',move:function(movesTo){
			this.currentPosition = movesTo;
		},equals:function(coin){
			return this.color == coin.color},
		kill:function(){},killed:function(){}};
		unsafeTile.place(coin);
		assert.ok(unsafeTile.contains(coin));
	});
	describe("Capture",function(){
	// 	var defaultGame;
	// 	beforeEach(function(){
	// 		defaultGame = new game([6],5,[1,2,3,4,5,6])
	// 	});
	// 	it("resets the killed coin",function(){
	// 		defaultGame.createPlayer("sooraj");
	// 		var sooraj = defaultGame.players.sooraj;
	// 		defaultGame.createPlayer("suman");
	// 		var suman = defaultGame.players.suman;
	// 		var tilesId = '2,1';
	// 		var sumanPath = suman.path.map(function(tile){return tile.id});
	// 		var path = ['4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2','0,1','0,0','1,0','2,0','3,0','4,0','4,1'];
	// 		assert.deepEqual(sumanPath,path);

	// 		defaultGame.tiles[tilesId].coin=sooraj.coins.sooraj1;
	// 		sooraj.coins.sooraj1.currentPosition = tilesId;
	// 		suman.coins.suman1.currentPosition = tilesId;
	// 		defaultGame.tiles[tilesId].capture(suman.coins.suman1,defaultGame);
	// 		assert.equal(sooraj.coins.sooraj1.currentPosition,-1);
	// 		assert.equal(suman.chances,1);
	// 		assert.ok(suman.matured);
	// 		sumanPathAfterKilling = suman.path.map(function(tile){return tile.id});
	// 		path = ['4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2','0,1','0,0','1,0','2,0','3,0','4,0','4,1',
	// 			'3,1','2,1','1,1','1,2','1,3','2,3','3,3','3,2','2,2'];
	// 		assert.deepEqual(sumanPathAfterKilling,path);
			
	// 		tilesId = '2,3';
	// 		defaultGame.tiles[tilesId].place(sooraj.coins.sooraj2);
	// 		defaultGame.tiles[tilesId].place(suman.coins.suman2);
	// 		defaultGame.tiles[tilesId].capture(suman.coins.suman1,defaultGame);
	// 		assert.equal(sooraj.coins.sooraj2.currentPosition,-1);
	// 		assert.ok(suman.matured);
	// 		sumanPathAfterKilling = suman.path.map(function(tile){return tile.id});
	// 		path = ['4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2','0,1','0,0','1,0','2,0','3,0','4,0','4,1',
	// 			'3,1','2,1','1,1','1,2','1,3','2,3','3,3','3,2','2,2'];
	// 		assert.deepEqual(sumanPathAfterKilling,path);
	// 	});
		it("does not do anything for similar coin",function(){
			defaultGame = {};
			defaultGame.tiles={'2,1':new tile.UnsafeTile('2,1')}
			defaultGame.players={suman:{
				id:'suman',
				coins:{
					suman1:{id:'suman1',equals:function(){return true}},
					suman2:{id:'suman2'}
				},
				chances:0
			}}
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
		var coin1={currentPosition:'2,0',color:'red',move:function(movesTo){
			this.currentPosition = movesTo;
		}};
		var coin2={currentPosition:'4,2',color:'yellow',move:function(movesTo){
			this.currentPosition = movesTo;
		}};
		var safePositions=[ '2,0', '4,2', '2,4', '0,2', '2,2' ];
		safePositions.forEach(function(pos){
			tiles[pos].place(coin1);
			tiles[pos].place(coin2);
			assert.ok(tiles[pos].contains(coin1));
			assert.ok(tiles[pos].contains(coin2));
		})
	});

	it("should generate all the unsafe tiles required for a given size",function(){
		var tiles=tile.generateTiles(5);
		var coin1={color:'red',currentPosition:'2,1',move:function(movesTo){
			this.currentPosition = movesTo;
		},equals:function(coin){
			return this.color == coin.color},
		kill:function(){},killed:function(){}};

		var coin2={color:'yellow',currentPosition:'2,3',move:function(movesTo){
			this.currentPosition = movesTo;
		},equals:function(coin){
			return this.color == coin.color},
		kill:function(){},killed:function(){}};

		var safePositions=['2,0', '4,2', '2,4', '0,2','2,2'];
		assert.equal(25,Object.keys(tiles).length);
		var unsafePositions=ld.difference(Object.keys(tiles),safePositions);
		unsafePositions.forEach(function(pos){
			tiles[pos].place(coin1);
			tiles[pos].place(coin2);
			assert.ok(!tiles[pos].contains(coin1));
			assert.ok(tiles[pos].contains(coin2));
		})
	});
});