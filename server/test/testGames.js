var lib = require('../games.js');
var assert = require('assert');
describe("removeGame", function () {
    it("remove unwanted game when that game is already completed", function () {
        var games = {
            123456: {players: {}, readyToRemove: true}, 345245: {players: {}, readyToRemove: false},
            9080980: {players: {}, readyToRemove: false}, 876789: {players: {}, readyToRemove: false},
            89799: {players: {}, readyToRemove: true}, 986768: {players: {}, readyToRemove: false}
        };
        assert.equal(Object.keys(lib.removeGame(games)).length, 4);
        assert.equal(Object.keys(lib.removeGame(games)).indexOf('123456'), -1);
        assert.equal(Object.keys(lib.removeGame(games)).indexOf('89799'), -1);
    });
});