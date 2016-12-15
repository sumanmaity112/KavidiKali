var tile = require('../sourceCode/tile.js').tile;
var Coin = require('../sourceCode/coin.js');
var game = require('../sourceCode/game.js');
var assert = require('assert');
var ld = require("lodash");

describe("Safe Tile", function() {
    it("should be able to answer if it holds a specific coin", function() {
        var safeTile = new tile.SafeTile("0,0");
        var coin = {
            p1: {
                currentPosition: '2,0'
            },
            move: function(movesTo) {
                coin['p1'].currentPosition = movesTo;
            }
        };
        safeTile.place(coin);
        assert.ok(safeTile.contains(coin));
    });
    it("should be able to answer if it does not hold a specific coin", function() {
        var safeTile = new tile.SafeTile("0,0");
        var coin = {
            p1: {
                currentPosition: '2,0'
            },
            move: function(movesTo) {
                coin['p1'].currentPosition = movesTo;
            }
        };
        var aDifferentCoin = {
            p1: {
                currentPosition: '2,0'
            },
            move: function(movesTo) {
                aDifferentCoin['p1'].currentPosition = movesTo;
            }
        };
        safeTile.place(coin);
        assert.ok(!safeTile.contains(aDifferentCoin));

    });
    describe("hasAnyCoin", function() {
        it("always return undefined", function() {
            var safeTile = new tile.SafeTile("0,0");
            assert.ok(!safeTile.hasAnyCoin());
        });
    });
    describe("remove coin", function() {
        it("remove a specific from if it hold that coin", function() {
            var safeTile = new tile.SafeTile('2,0');
            var rock1 = {
                id: 'rock1'
            };
            var rock3 = {
                id: 'rock3'
            };
            var john4 = {
                id: 'john4'
            };
            safeTile.coins = [rock1, rock3, john4];
            safeTile.removeCoin(rock1);
            assert.equal(safeTile.coins.length, 2);
        });
        it("doesn't remove a coin if it doesn't hold that coin", function() {
            var safeTile = new tile.SafeTile('2,0');
            var rock1 = {
                id: 'rock1'
            };
            var rock3 = {
                id: 'rock3'
            };
            var john4 = {
                id: 'john4'
            };
            var rock2 = {
                id: 'rock2'
            }
            safeTile.coins = [rock1, rock3, john4];
            safeTile.removeCoin(rock2);
            assert.equal(safeTile.coins.length, 3);
        });
    });
});

describe("Unsafe Tile", function() {
    it("should be able to hold a coin of a player", function() {
        var unsafeTile = new tile.UnsafeTile("0,0");
        var coin = {
            color: 'red',
            currentPosition: '2,1',
            move: function(movesTo) {
                this.currentPosition = movesTo;
            },
            equals: function(coin) {
                return this.color == coin.color
            },
            kill: function() {},
            killed: function() {}
        };
        unsafeTile.place(coin);
        assert.ok(unsafeTile.contains(coin));
    });
    describe("Capture", function() {
        it("move one coin to its parking position", function() {
            var unsafeTile = new tile.UnsafeTile("0,0");
            var move = function(movesTo) {
                this.currentPosition = movesTo;
            };
            var equals = function(coin) {
                return this.color == coin.color
            };
            var kill = function() {
                this.move(-1)
            };


            var coin1 = {
                id: 'coin1',
                color: 'red',
                currentPosition: '0,0',
                move: move,
                equals: equals,
                kill: kill,
                killed: function() {}
            };
            unsafeTile.place(coin1)
            var coin2 = {
                id: 'coin2',
                color: 'yellow',
                currentPosition: '2,1',
                move: move,
                equals: equals,
                kill: kill,
                killed: function() {}
            };
            unsafeTile.place(coin2)
            assert.equal(coin1.currentPosition, -1);
            assert.equal(coin2.currentPosition, '0,0');

        });
        it("does not do anything for similar coin", function() {
            defaultGame = {};
            defaultGame.tiles = {
                '2,1': new tile.UnsafeTile('2,1')
            }
            defaultGame.players = {
                ron: {
                    id: 'ron',
                    coins: {
                        ron1: {
                            id: 'ron1',
                            equals: function() {
                                return true
                            }
                        },
                        ron2: {
                            id: 'ron2'
                        }
                    },
                    chances: 0
                }
            }
            var ron = defaultGame.players.ron;
            var tilesId = '2,1';
            defaultGame.tiles[tilesId].coin = ron.coins.ron1;
            ron.coins.ron1.currentPosition = tilesId;
            ron.coins.ron2.currentPosition = tilesId;
            defaultGame.tiles[tilesId].capture(ron.coins.ron1, defaultGame);
            assert.equal(ron.coins.ron2.currentPosition, tilesId);
            assert.equal(ron.chances, 0)
        });
    });
    describe("remove coin", function() {
        it("remove coin which is hold by it", function() {
            var unsafeTile = new tile.UnsafeTile('2,1');
            unsafeTile.coin = {
                id: 'rock1'
            };
            unsafeTile.removeCoin();
            assert.ok(!unsafeTile.coin)
        });
    });
});

describe("Generate Tiles", function() {
    it("should generate all the safe tiles required for a given size", function() {
        var tiles = tile.generateTiles(5);
        var coin1 = {
            currentPosition: '2,0',
            color: 'red',
            move: function(movesTo) {
                this.currentPosition = movesTo;
            }
        };
        var coin2 = {
            currentPosition: '4,2',
            color: 'yellow',
            move: function(movesTo) {
                this.currentPosition = movesTo;
            }
        };
        var safePositions = ['2,0', '4,2', '2,4', '0,2', '2,2'];
        safePositions.forEach(function(pos) {
            tiles[pos].place(coin1);
            tiles[pos].place(coin2);
            assert.ok(tiles[pos].contains(coin1));
            assert.ok(tiles[pos].contains(coin2));
        })
    });

    it("should generate all the unsafe tiles required for a given size", function() {
        var tiles = tile.generateTiles(5);
        var coin1 = {
            color: 'red',
            currentPosition: '2,1',
            move: function(movesTo) {
                this.currentPosition = movesTo;
            },
            equals: function(coin) {
                return this.color == coin.color
            },
            kill: function() {},
            killed: function() {}
        };

        var coin2 = {
            color: 'yellow',
            currentPosition: '2,3',
            move: function(movesTo) {
                this.currentPosition = movesTo;
            },
            equals: function(coin) {
                return this.color == coin.color
            },
            kill: function() {},
            killed: function() {}
        };

        var safePositions = ['2,0', '4,2', '2,4', '0,2', '2,2'];
        assert.equal(25, Object.keys(tiles).length);
        var unsafePositions = ld.difference(Object.keys(tiles), safePositions);
        unsafePositions.forEach(function(pos) {
            tiles[pos].place(coin1);
            tiles[pos].place(coin2);
            assert.ok(!tiles[pos].contains(coin1));
            assert.ok(tiles[pos].contains(coin2));
        })
    });
});
