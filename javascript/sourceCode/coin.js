var EventEmitter=require('events').EventEmitter;

var Coin = function(id,colour){
	this.id = id;
	this.currentPosition = -1 ;
	this.reachedDestination = false;
	this.colour=colour;
	this.emitter=new EventEmitter();
};

Coin.prototype = {
	addListener:function(listener) {
		this.emitter.addListener("have_killed",listener.whenCoinKills.bind(listener));
	},
	equals:function(other) {
		return this.colour==other.colour;
	},
	move:function(movesTo) {
		this.currentPosition = movesTo;
	},
	kill:function() {
		this.move(-1);	
	},
	killed:function() {
		this.emitter.emit("have_killed");
	}
};

exports.coin=Coin;
