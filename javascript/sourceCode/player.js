const UNEXTENDED_PATH_LENGTH = 16,
    SPECIAL_VALUE = 6;
var Coin = require('./coin.js');
var ld = require('lodash');
var EventEmitter = require('events').EventEmitter;

var Player = function(id, path, coins, extendedPath) {
    this.id = id;
    this.matured = false;
    this.chances = 0;
    this.diceValues = [];
    this.coins = coins;
    this.path = path;
    this.extendedPath = extendedPath;
    this.emitter = new EventEmitter();
    this.notification_text;

};

Player.prototype = {
    get notification() {
        return this.notification_text;
    },
    rollDice: function(dice) {
        var diceValue = dice.roll();
        this.diceValues.push(diceValue);
        this.notification_text = this.id + " got " + diceValue + "" + this.diceValues.length;
        this.emitter.emit("new_notification");
        this.chances--;
        return diceValue;
    },
    whenCoinKills: function() {
        this.matured = true;
        this.chances++;
        this.notification_text = (this.id + "'s one coin kill opponents coin " + this.id + ' get an extra chance to roll dice');
        this.emitter.emit("new_notification");
        if (this.path.length == UNEXTENDED_PATH_LENGTH)
            this.path = this.path.concat(this.extendedPath);
    },
    moveCoin: function(coinID, movesTo) {
        var coin = this.coins[coinID];
        if (coin) {
            if (coin.isAtBeach()) {
                moveCoinToBoard.apply(this, [coin, movesTo]);
            } else {
                moveCoinOnBoard.apply(this, [coin, movesTo]);
            };
            return declareIfWon.apply(this);
        }
    },
    get isWin() {
        var coins = this.coins;
        return Object.keys(this.coins).every(function(coin) {
            return coins[coin].reachedDestination;
        });
    },
    addListener: function(listener) {
        this.emitter.addListener("Game_over", listener.whenGameOver.bind(listener));
        this.emitter.addListener("new_notification", listener.createNote.bind(listener));
    },
    get coinColor() {
        return this.coins[this.id + '1'].colour;
    },

    hasAnyOtherChance: function() {
        return this.chances > 0;
    }
};

var removeValue = function(list, value) {
    var index = list.indexOf(value);
    list.splice(index, 1);
};

var moveCoinToBoard = function(coin, movesTo) {
    if (getFirstValue(this.path).id == movesTo && doesItHas(this.diceValues, SPECIAL_VALUE)) {
        getFirstValue(this.path).place(coin);
        removeValue(this.diceValues, SPECIAL_VALUE);
    };
};

var moveCoinOnBoard = function(coin, movesTo) {
    var currTileIndex = findInPath(this.path, coin.currentPosition);
    var nextTileIndex = findInPath(this.path, movesTo);
    var dice = legitimateDiceValue(currTileIndex, nextTileIndex);
    if (doesItHas(this.diceValues, dice)) {
        this.path[nextTileIndex].place(coin);
        removeValue(this.diceValues, dice);
        this.path[currTileIndex].removeCoin(coin);
    };
};

var declareIfWon = function() {
    return this.isWin && this.emitter.emit("Game_over") || false;
};

var getFirstValue = function(array) {
    return array[0];
};

var legitimateDiceValue = function(currTileIndex, nextTileIndex) {
    var dice = nextTileIndex - currTileIndex;
    return (dice < 0) ? (UNEXTENDED_PATH_LENGTH + dice) : dice;
};

var doesItHas = function(list, value) {
    return list.indexOf(value) >= 0;
};

var findInPath = function(path, id) {
    return ld.findIndex(path, {
        id: id
    });
};

module.exports = Player;
