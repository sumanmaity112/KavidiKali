var Player = require('../sourceCode/player.js');
var sinon = require('sinon');
var assert = require('assert');
var place, removeCoin, path;
describe('Player', function() {
    it('creates an object with given id and properties "matured" and "diceValues"', function() {
        var player = new Player('p1');
        assert.equal('p1', player.id);
        assert.equal(false, player.matured);
    });
    describe('rollDice', function() {
        it('rolls the given dice and adds the values to diceValues', function() {
            var player = new Player('p1');
            var dice = {
                roll: sinon.stub().returns(2)
            }
            assert.deepEqual(2, player.rollDice(dice));
            assert.deepEqual(player.diceValues, [2]);
        });
    });

    describe('moveCoin', function() {
        beforeEach(function() {
            place = function(coin) {
                coin.move(this.id)
            };
            removeCoin = function() {};
            path = [{
                id: '2,0',
                place: place,
                removeCoin: removeCoin
            }, {
                id: '3,0',
                place: place,
                removeCoin: removeCoin
            }, {
                id: '4,0',
                place: place,
                removeCoin: removeCoin
            }];

        });
        it('moves the selected coin to home if coin is off-Board and player has six on dice', function() {
            var coins = {
                Rocky1: {
                    id: 'Rocky1',
                    currentPosition: -1,
                    move: function(movesTo) {
                        coin.currentPosition = movesTo
                    },
                    isAtBeach: () => true
                }
            }
            var dice = {
                roll: sinon.stub().returns(6)
            };
            var player = new Player('Rocky', path, coins);
            player.rollDice(dice);
            var coin = player.coins['Rocky1'];
            player.moveCoin('Rocky1', player.path[0].id);
            assert.deepEqual(coin.currentPosition, player.path[0].id);
        });

        it('moves the selected coin to the given place', function() {
            var coins = {
                Rony1: {
                    id: 'Rony1',
                    currentPosition: -1,
                    move: function(movesTo) {
                        coin.currentPosition = movesTo
                    },
                    isAtBeach: function() {
                        return this.currentPosition == -1
                    }
                }
            }
            var dice = {
                roll: sinon.stub().returns(6)
            };
            var player = new Player('Rony', path, coins)
            player.rollDice(dice);
            var coin = player.coins['Rony1'];
            player.moveCoin('Rony1', player.path[0].id);
            assert.deepEqual(coin.currentPosition, player.path[0].id);
            var dice1 = {
                roll: sinon.stub().returns(2)
            };
            player.rollDice(dice1);
            player.moveCoin('Rony1', '4,0');
            assert.deepEqual(coin.currentPosition, player.path[2].id);
        });

        it('doesn\'t moves the selected coin to the unvalid position', function() {
            var coins = {
                Jani1: {
                    id: 'Jani1',
                    currentPosition: '2,0',
                    move: function(movesTo) {
                        coin.currentPosition = movesTo
                    },
                    isAtBeach: () => this.currentPosition == -1
                }
            }
            var dice = {
                roll: sinon.stub().returns(1)
            };
            var player = new Player('Jani', path, coins)
            player.rollDice(dice);
            var coin = player.coins['Jani1'];
            player.moveCoin('Jani1', '4,2');
            assert.deepEqual(coin.currentPosition, player.path[0].id);
        });
        it('does nothing if given an invalid coin', function() {
            var coins = {
                Jani1: {
                    id: 'Jani1',
                    currentPosition: '2,0',
                    move: function(movesTo) {
                        coin.currentPosition = movesTo
                    },
                    isAtBeach: () => this.currentPosition == -1
                }
            }
            var player = new Player('Jani', path, coins)
            var stateofPlayer = JSON.stringify(player);
            player.moveCoin('hahaha', '4,2');

            assert.deepEqual(stateofPlayer, JSON.stringify(player));
        });
        it('does nothing if given the starting location but has\'t got 6 on dice', function() {
            var coins = {
                Jani1: {
                    id: 'Jani1',
                    currentPosition: -1,
                    move: function(movesTo) {
                        this.currentPosition = movesTo
                    },
                    isAtBeach: () => true
                }
            }
            var dice = {
                roll: sinon.stub().returns(1)
            };
            var stateOfCoins = JSON.stringify(coins);
            var player = new Player('Jani', path, coins);
            player.rollDice(dice);
            player.moveCoin('Jani1', '2,0');
            assert.deepEqual(stateOfCoins, JSON.stringify(player.coins));
        });
        it('does nothing if given coin is off-Board and any other position than starting position', function() {
            var path = [{
                id: '2,0',
                place: place,
                removeCoin: removeCoin
            }, {
                id: '3,0',
                place: place,
                removeCoin: removeCoin
            }, {
                id: '4,0',
                place: place,
                removeCoin: removeCoin
            }];

            var coins = {
                Jani1: {
                    id: 'Jani1',
                    currentPosition: -1,
                    move: function(movesTo) {
                        coin.currentPosition = movesTo
                    },
                    isAtBeach: () => this.currentPosition == -1
                }
            }
            var dice = {
                roll: sinon.stub().returns(6)
            };
            var stateOfCoins = JSON.stringify(coins);
            var player = new Player('Jani', path, coins);
            player.rollDice(dice);
            player.moveCoin('Jani1', '4,0');
            assert.deepEqual(stateOfCoins, JSON.stringify(player.coins));
        });
    });
    describe("WhenCoinKills", function() {
        it("extends the path of the player with given extenedPath", function() {
            var path = [{
                id: '2,0'
            }, {
                id: '3,0'
            }, {
                id: '4,0'
            }];
            var extenedPath = [];
            var coins = {
                Jani1: {
                    id: 'Jani1'
                }
            };
            var player = new Player('Jani', path, coins, extenedPath);
            player.whenCoinKills();
            assert.ok(player.matured);
        });
        it("extends the path of the player with given extenedPath if the path is of length 16", function() {
            var path = [{
                id: '2,0'
            }, {
                id: '3,0'
            }, {
                id: '4,0'
            }, , , , , , , , , , , , , , ];
            var extenedPath = [{
                id: '5,0'
            }];
            var coins = {
                Jani1: {
                    id: 'Jani1'
                }
            };
            var player = new Player('Jani', path, coins, extenedPath);
            player.whenCoinKills();
            assert.deepEqual(player.path, path.concat(extenedPath));
        });
    });
    describe("get coinColor", function() {
        it("is the color of coins player has", function() {
            var path = [];
            var extenedPath = [];
            var coins = {
                Jani1: {
                    id: 'Jani1',
                    colour: 'red'
                }
            };
            var player = new Player('Jani', path, coins, extenedPath);
            assert.ok(player.coinColor == 'red');
        });
    });
    describe("isWin", function() {
        it("gives message that game over when one player wins", function() {
            var place = function(coin) {
                coin.move()
            };
            var listener = {
                gameOver: false,
                whenGameOver: function() {
                    this.gameOver = true
                },
                createNote: function() {}
            };
            var removeCoin = function() {};
            var path = [{
                id: '2,0',
                place: place,
                removeCoin: removeCoin
            }, {
                id: '4,2',
                place: place
            }];
            var extenedPath = [];
            var coins = {
                Jani1: {
                    id: 'Jani1',
                    currentPosition: '2,0',
                    reachedDestination: false,
                    move: function() {
                        this.reachedDestination = true;
                    },
                    isAtBeach: () => this.currentPosition == -1
                }
            };
            var dice = {
                roll: function() {
                    return 1
                }
            };

            var player = new Player('Jani', path, coins, extenedPath);
            player.addListener(listener);
            player.rollDice(dice);
            player.moveCoin('Jani1', '4,2');
            player.notification;
            assert.ok(listener.gameOver);
        });
    });
});
