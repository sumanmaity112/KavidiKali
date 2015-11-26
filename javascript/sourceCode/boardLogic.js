var lodash = require('lodash');
var gameLogic = require('./kavidiKaliLib.js');
//------------------------------------------------------------------------------>
var outerLoop =['0,0','1,0','2,0','3,0','4,0','4,1','4,2','4,3','4,4','3,4','2,4','1,4','0,4','0,3','0,2','0,1'];


var gettingTheValidMove = function(currentPosition,movesBy){
	var coinIndex = outerLoop.indexOf(currentPosition);
	var nextIndex = (coinIndex+movesBy)%outerLoop.length;
	return outerLoop[nextIndex];

};

console.log(gettingTheValidMove('2,0',17));


var gettingALLTheValidMovesOfCoin =  function(coin,diceValues){
	return diceValues.map(function(diceValue){
		return gettingTheValidMove(coin.currentPosition,diceValue);
	});
};

var coin = new gameLogic.entities.Coin('red1');
coin.move('2,0');

var coin1 = new gameLogic.entities.Coin('red2');
coin1.move('4,4');

var diceValues = [6,4,2,1];

console.log(gettingALLTheValidMovesOfCoin(coin,diceValues));
console.log(gettingALLTheValidMovesOfCoin(coin1,diceValues));