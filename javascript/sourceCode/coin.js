var Coin = function(id,colour){
	this.id = id;
	this.currentPosition = -1;
	this.reachedDestination = false;
	this.colour=colour;
};

Coin.prototype = {
};

exports.coin=Coin;
