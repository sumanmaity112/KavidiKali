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
	},
	removeCoin:function(coin) {
		var ind = ld.findIndex(this.coins,coin);
		this.coins = this.coins.filter(function(value,index){
			return ind!=index;
		});
	},
	hasAnyCoin:function(){
		return false;
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
		return this.hasAnyCoin() && this.coin.equals(coin);
	},
	removeCoin:function(coin) {
		this.coin = undefined;
	},
	hasAnyCoin:function(){
		return this.coin;
	},
	capture:function(coin){
		if(this.coin && !this.coin.equals(coin)){
			this.coin.kill();
			this.coin = coin;
			this.coin.killed();
		}
	}
};

var idFromPos= function(column,row) {
	return column+","+row;
};

tile.generateTiles = function(size){
	var grid = {};
	for (var row = 0; row < size; row++) {
		for (var column = 0; column < size; column++) {
			var id=idFromPos(column,row);
			grid[id]= new tile.UnsafeTile(id);
		};
	};
	exports.generateSafePositions(size).forEach(function(pos){
		grid[pos]= new tile.SafeTile(pos);
	});
	return grid;
};

exports.generateSafePositions = function(size){
	var safePlaces = [];
	safePlaces.push(idFromPos(Math.floor(size/2),0));
	safePlaces.push(idFromPos(size-1,Math.floor(size/2)));
	safePlaces.push(idFromPos(Math.floor(size/2),size-1));
	safePlaces.push(idFromPos(0,Math.floor(size/2)));
	safePlaces.push(idFromPos(Math.floor(size/2),Math.floor(size/2)));
	return safePlaces;
};

exports.tile=tile;