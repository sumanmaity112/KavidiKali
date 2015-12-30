var Player = require('../sourceCode/player.js');
var sinon = require('sinon');
var assert = require('assert');

describe('Player',function(){
	it('creates an object with given id and properties "matured" and "diceValues"', function(){
		var player = new Player('p1');
		assert.equal('p1',player.id);
		assert.equal(false,player.matured);
	});
	describe('rollDice',function(){
		it('rolls the given dice and adds the values to diceValues',function(){
			var player = new Player('p1');
			var dice = {roll:sinon.stub().returns(2)}
			assert.deepEqual(2,player.rollDice(dice));
			assert.deepEqual(player.diceValues,[2]);
		});
	});

	describe('moveCoin',function(){
		it('moves the selected coin to home if coin is off-Board and player has six on dice',function(){
			var coins = {Rocky1:{id:'Rocky1',currentPosition:-1,move:function(movesTo){coin.currentPosition=movesTo}}}
			var dice = {roll:sinon.stub().returns(6)};
			var path = [{id:'2,0',
						place:function(coin){
							coin.move(this.id);

			}}]
			var player = new Player('Rocky',path,coins);
			player.rollDice(dice);
			var coin = player.coins['Rocky1'];
			player.moveCoin('Rocky1',player.path[0].id);
			assert.deepEqual(coin.currentPosition,player.path[0].id);
		});
		it('moves the selected coin to the given place',function(){
			var coins = {Rony1:{id:'Rony1',currentPosition:-1,move:function(movesTo){coin.currentPosition=movesTo}}}
			var dice = {roll:sinon.stub().returns(6)};
			var place = function(coin){
							coin.move(this.id);
						}
			var removeCoin = function(){};
			var path = [{id:'2,0',place:place,removeCoin:removeCoin},
						{id:'3,0',place:place,removeCoin:removeCoin},
						{id:'4,0',place:place,removeCoin:removeCoin}]
			var player = new Player('Rony',path,coins)
			player.rollDice(dice);
			var coin = player.coins['Rony1'];
			player.moveCoin('Rony1',player.path[0].id);
			assert.deepEqual(coin.currentPosition,player.path[0].id);
			var dice1 = {roll:sinon.stub().returns(2)};
			player.rollDice(dice1);
			player.moveCoin('Rony1','4,0');
			assert.deepEqual(coin.currentPosition,player.path[2].id);
		});
		it('doesn\'t moves the selected coin to the unvalid position',function(){
			var coins = {Jani1:{id:'Jani1',currentPosition:'2,0',move:function(movesTo){coin.currentPosition=movesTo}}}
			var dice = {roll:sinon.stub().returns(1)};
			var place = function(coin){
							coin.move(this.id);
						}
			var removeCoin = function(){};
			var path = [{id:'2,0',place:place,removeCoin:removeCoin},
						{id:'3,0',place:place,removeCoin:removeCoin},
						{id:'4,0',place:place,removeCoin:removeCoin}]
			var player = new Player('Jani',path,coins)
			player.rollDice(dice);
			var coin = player.coins['Jani1'];
			player.moveCoin('Jani1','4,2');
			assert.deepEqual(coin.currentPosition,player.path[0].id);
		});
	});
}); 
