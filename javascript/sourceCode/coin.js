const INITIAL_POSITION = -1,
    DESTINATION = '2,2';
var EventEmitter = require('events').EventEmitter;

var Coin = function(id, colour) {
    this.id = id;
    this.currentPosition = INITIAL_POSITION;
    this.reachedDestination = false;
    this.colour = colour;
    this.emitter = new EventEmitter();
};

Coin.prototype = {
    addListener: function(listener) {
        this.emitter.addListener("have_killed", listener.whenCoinKills.bind(listener));
    },
    equals: function(other) {
        return this.colour == other.colour;
    },
    move: function(movesTo) {
        this.currentPosition = movesTo;
        if (this.currentPosition == DESTINATION)
            this.reachedDestination = true;
    },
    kill: function() {
        this.move(INITIAL_POSITION);
    },
    killed: function() {
        this.emitter.emit("have_killed");
    },
    isAtBeach: function() {
        return this.currentPosition == INITIAL_POSITION;
    }
};

module.exports = Coin;
