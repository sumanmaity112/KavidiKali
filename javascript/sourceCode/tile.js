var ld = require("lodash");
var tile = {};

class SafeTile {
    constructor(id) {
        this.id = id;
        this.coins = [];
    }

    place(coin) {
        coin.move(this.id);
        this.coins.push(coin);
    }

    contains(coin) {
        return ld.findIndex(this.coins, coin) >= 0;
    }

    removeCoin(coin) {
        var ind = ld.findIndex(this.coins, coin);
        (ind > -1) && this.coins.splice(ind, 1);
    }

    hasAnyCoin() {
        return false;
    }
};

class UnsafeTile {
    constructor(id) {
        this.id = id;
        this.coins = [];
    }

    place(coin) {
        if (!this.capture(coin)) {
            this.coin = coin;
            coin.move(this.id);
        };
    }

    contains(coin) {
        return this.hasAnyCoin() && this.coin.equals(coin);
    }

    removeCoin(coin) {
        this.coin = undefined;
    }

    hasAnyCoin() {
        return this.coin;
    }

    capture(coin) {
        if (this.coin && !this.coin.equals(coin)) {
            this.coin.kill();
            coin.move(this.id);
            this.coin = coin;
            this.coin.killed();
            return true;
        }
    }
};

var idFromPos = function(column, row) {
    return column + "," + row;
};

var generateTiles = function(size) {
    var grid = {};
    for (var row = 0; row < size; row++) {
        for (var column = 0; column < size; column++) {
            var id = idFromPos(column, row);
            grid[id] = new UnsafeTile(id);
        };
    };
    generateSafePositions(size).forEach(function(pos) {
        grid[pos] = new SafeTile(pos);
    });
    return grid;
};

var generateSafePositions = function(size) {
    var safePlaces = [];
    safePlaces.push(idFromPos(Math.floor(size / 2), 0));
    safePlaces.push(idFromPos(size - 1, Math.floor(size / 2)));
    safePlaces.push(idFromPos(Math.floor(size / 2), size - 1));
    safePlaces.push(idFromPos(0, Math.floor(size / 2)));
    safePlaces.push(idFromPos(Math.floor(size / 2), Math.floor(size / 2)));
    return safePlaces;
};

var tile = {
    SafeTile,
    UnsafeTile,
    generateTiles
};


module.exports = {
    tile,
    generateSafePositions
};
