var lib = require('../sourceCode/generatePath.js');
var assert = require('assert');

describe("generateHalfPath", function () {
    it("gives the outerloop for any given position", function () {
        var path = ['2,0', '3,0', '4,0', '4,1', '4,2', '4,3', '4,4', '3,4', '2,4', '1,4', '0,4', '0,3', '0,2', '0,1', '0,0', '1,0'];
        assert.deepEqual(path, lib.generateHalfPath('2,0'));
        path = ['0,2', '0,1', '0,0', '1,0', '2,0', '3,0', '4,0', '4,1', '4,2', '4,3', '4,4', '3,4', '2,4', '1,4', '0,4', '0,3'];
        assert.deepEqual(path, lib.generateHalfPath('0,2'));
        path = ['4,2', '4,3', '4,4', '3,4', '2,4', '1,4', '0,4', '0,3', '0,2', '0,1', '0,0', '1,0', '2,0', '3,0', '4,0', '4,1'];
        assert.deepEqual(path, lib.generateHalfPath('4,2'));
        path = ['2,4', '1,4', '0,4', '0,3', '0,2', '0,1', '0,0', '1,0', '2,0', '3,0', '4,0', '4,1', '4,2', '4,3', '4,4', '3,4'];
        assert.deepEqual(path, lib.generateHalfPath('2,4'));
    });

});

describe("generateFullPath", function () {
    it("gives the outerloop for any given position", function () {
        var path = ['2,0', '3,0', '4,0', '4,1', '4,2', '4,3', '4,4', '3,4', '2,4', '1,4', '0,4', '0,3', '0,2', '0,1', '0,0', '1,0',
            '1,1', '1,2', '1,3', '2,3', '3,3', '3,2', '3,1', '2,1', '2,2'];
        assert.deepEqual(path, lib.generateFullPath('2,0'));
        path = ['0,2', '0,1', '0,0', '1,0', '2,0', '3,0', '4,0', '4,1', '4,2', '4,3', '4,4', '3,4', '2,4', '1,4', '0,4', '0,3',
            '1,3', '2,3', '3,3', '3,2', '3,1', '2,1', '1,1', '1,2', '2,2'];
        assert.deepEqual(path, lib.generateFullPath('0,2'));
        path = ['4,2', '4,3', '4,4', '3,4', '2,4', '1,4', '0,4', '0,3', '0,2', '0,1', '0,0', '1,0', '2,0', '3,0', '4,0', '4,1',
            '3,1', '2,1', '1,1', '1,2', '1,3', '2,3', '3,3', '3,2', '2,2'];
        assert.deepEqual(path, lib.generateFullPath('4,2'));
        path = ['2,4', '1,4', '0,4', '0,3', '0,2', '0,1', '0,0', '1,0', '2,0', '3,0', '4,0', '4,1', '4,2', '4,3', '4,4', '3,4',
            '3,3', '3,2', '3,1', '2,1', '1,1', '1,2', '1,3', '2,3', '2,2'];
        assert.deepEqual(path, lib.generateFullPath('2,4'));
    });

});

describe("generateExtendedPath", function () {
    it("gives the outerloop for any given position", function () {
        var path = ['1,1', '1,2', '1,3', '2,3', '3,3', '3,2', '3,1', '2,1', '2,2'];
        assert.deepEqual(path, lib.generateExtendedPath('2,0'));
        path = ['1,3', '2,3', '3,3', '3,2', '3,1', '2,1', '1,1', '1,2', '2,2'];
        assert.deepEqual(path, lib.generateExtendedPath('0,2'));
        path = ['3,1', '2,1', '1,1', '1,2', '1,3', '2,3', '3,3', '3,2', '2,2'];
        assert.deepEqual(path, lib.generateExtendedPath('4,2'));
        path = ['3,3', '3,2', '3,1', '2,1', '1,1', '1,2', '1,3', '2,3', '2,2'];
        assert.deepEqual(path, lib.generateExtendedPath('2,4'));
    });

});