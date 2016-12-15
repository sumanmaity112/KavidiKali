const INITIAL_POSITION = -1,
    DESTINATION = '2,2';
var EventEmitter = require('events').EventEmitter;

class Coin {
    constructor(id, colour) {
        this.id = id;
        this.currentPosition = INITIAL_POSITION;
        this.reachedDestination = false;
        this.colour = colour;
        this.emitter = new EventEmitter();
    }
    addListener(listener) {
        this.emitter.addListener("have_killed", listener.whenCoinKills.bind(listener));
    }

    equals(other) {
        return this.colour == other.colour;
    }

    move(movesTo) {
        this.currentPosition = movesTo;
        if (this.currentPosition == DESTINATION)
            this.reachedDestination = true;
    }

    kill() {
        this.move(INITIAL_POSITION);
    }

    killed() {
        this.emitter.emit("have_killed");
    }

    isAtBeach() {
        return this.currentPosition == INITIAL_POSITION;
    }
}

module.exports = Coin;
