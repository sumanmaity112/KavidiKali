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

exports.tile=tile;