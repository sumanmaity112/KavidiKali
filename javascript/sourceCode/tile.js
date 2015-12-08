var ld=require("lodash");
var tile={};

tile.SafeTile=function(id) {
	this.id=id;
	this.coins=[];
}

tile.SafeTile.prototype = {
	place:function(coin) {
		this.coins.push(coin);
	},
	contains:function(coin) {
		return ld.findIndex(this.coins,coin)>=0;
	}
}

tile.UnsafeTile=function(id) {
	this.id=id;
	this.coin=undefined;
}

tile.UnsafeTile.prototype = {
	place:function(coin) {
		this.coin=coin;
	},
	contains:function(coin) {
		return this.coin.equals(coin);
	}
}

var idFromPos= function(i,j) {
	return i+","+j;
};

tile.generateTiles = function(size){
	var grid = {};
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			var id=idFromPos(i,j);
			grid[id]= new tile.UnsafeTile(id);
		};
	};
	generateSafePositions(size).forEach(function(pos){
		grid[pos]=new tile.SafeTile(pos);
	});
	return grid;
};

var generateSafePositions = function(size){
	var safePlaces = [];
	safePlaces.push(idFromPos(Math.floor(size/2),0));
	safePlaces.push(idFromPos(size-1,Math.floor(size/2)));
	safePlaces.push(idFromPos(Math.floor(size/2),size-1));
	safePlaces.push(idFromPos(0,Math.floor(size/2)));
	safePlaces.push(idFromPos(Math.floor(size/2),Math.floor(size/2)));
	return safePlaces;
};

exports.tile=tile;