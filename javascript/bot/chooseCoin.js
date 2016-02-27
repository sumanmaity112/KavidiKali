var lodash = require('lodash');
var http = require('http');
const myDetails ='/enquiry?question=myInfo';
var findMyDetails = function(option,self){
	option.path=myDetails;
	http.get(option,function(res){
		res.on('data',function(metaData){
			var myGameStatus = JSON.parse(metaData);
			chooseCoin(myGameStatus,self,option);
		})
	})
};

var chooseCoin = function(myGameStatus,self,option){
	var coins = myGameStatus.coins;
	console.log(myGameStatus.diceValues.length,"******************",myGameStatus.diceValues);
	if(myGameStatus.diceValues.indexOf(6)!=-1) {
		var coinsEligibleToEnter = getOffBoardCoins(coins);
		console.log(coinsEligibleToEnter);
		var selectedCoin = coinsEligibleToEnter[0];
		option.path = '/instruction?action=moveCoin&coin=' + selectedCoin.id +'&position='+ myGameStatus.path[0].id; 
		moveCoin(option);
		// selectedCoin.currentPosition = myGameStatus.path[0].id;
	}
	else{
		var coinsEligibleToMove = getOnBoardCoins(coins);
		if(coinsEligibleToMove.length && myGameStatus.diceValues.length){
			console.log(coinsEligibleToMove);
			var selectedCoin = coinsEligibleToMove[0];
			var coinsCurrentIndex = lodash.findIndex(myGameStatus.path,{id:selectedCoin.currentPosition});
			var coinsNextIndex = (coinsCurrentIndex+myGameStatus.diceValues[0]) % myGameStatus.path.length;
			console.log("-- in else",coinsCurrentIndex,"       ",selectedCoin.currentPosition,"            ",coinsCurrentIndex+myGameStatus.diceValues[0]);
			console.log(myGameStatus.path[coinsCurrentIndex+myGameStatus.diceValues[0]],"**^^^^")
			option.path = '/instruction?action=moveCoin&coin=' + selectedCoin.id +'&position='+ myGameStatus.path[coinsNextIndex].id;
			moveCoin(option);
		}
	}
	if(myGameStatus.diceValues.length!=0)
		setTimeout(findMyDetails(option,self),10000);
}

var moveCoin = function(option){
	console.log(option.path);
	http.get(option,function(res){});
}

var getOffBoardCoins = function(coins){
	return lodash.filter(coins,function(coin){
		return coin.currentPosition==-1;
	});
}

var getOnBoardCoins = function(coins){
	return lodash.filter(coins,function(coin){
		return coin.currentPosition!=-1;
	});
}

module.exports = findMyDetails;
