var Coin = function(id,colour,defaultCurrentPos){
	this.id = id;
	this.currentPosition = defaultCurrentPos;
	this.reachedDestination = false;
	this.colour=colour;
};

Coin.prototype = {
	equals:function(other) {
		return this.colour==other.colour && this.id==other.id;
	}
};

exports.coin=Coin;
