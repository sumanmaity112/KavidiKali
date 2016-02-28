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
	option.path='/update?toUpdate=board';
	http.get(option,function(res){
		res.on('data',function(metaData){
			var availableCoin = chooseBestCoinToMove(JSON.parse(metaData),myGameStatus,myGameStatus.diceValues[0]);
			option.path = '/instruction?action=moveCoin&coin=' + availableCoin.coinId +'&position='+ availableCoin.tileId;
			moveCoin(option);
			if(myGameStatus.diceValues.length>1)
				findMyDetails(option,self);
		})
	})
	
}

var moveCoin = function(option){
	console.log(option.path,"**^^^");
	http.get(option,function(res){});
}

var getOffBoardCoins = function(coins){
	return lodash.filter(coins,function(coin){
		return coin.currentPosition==-1;
	});
}

var getOnBoardCoins = function(coins){
	return lodash.filter(coins,function(coin){
		return coin.currentPosition!=-1 && coin.currentPosition!='2,2';
	});
}
var chooseBestCoinToMove=function(stateOfTheGame,myGameStatus,diceValue){
	var path = myGameStatus.path;
	var coins = myGameStatus.coins;
	var myCoinColor = 'green';
	var opponentsCoins = lodash.filter(stateOfTheGame,function(coin){return coin.colour!=myCoinColor});
	// console.log(opponentsCoins);




	var coinsEligibleToEnter = getOffBoardCoins(coins);
	

	if(myGameStatus.diceValues.indexOf(6)!=-1 && coinsEligibleToEnter.length) {
		return {coinId:coinsEligibleToEnter[0].id,tileId:path[0].id};
	}
	else{
		var coinsEligibleToMove = getOnBoardCoins(coins);
		if(coinsEligibleToMove.length && myGameStatus.diceValues.length){
			var result = chooseValidCoin(myGameStatus,coinsEligibleToMove,diceValue,opponentsCoins);
			return result;
		}
	}
	return {};

}
var chooseValidCoin=function(myGameStatus,coinsEligibleToMove,diceValue,opponentsCoins){
	if(!coinsEligibleToMove.length)
		return {};
	for(var coin in coinsEligibleToMove){
		var coinsCurrentIndex = lodash.findIndex(myGameStatus.path,{id:coinsEligibleToMove[coin].currentPosition});
		// var coinsNextIndex = (coinsCurrentIndex+diceValue) % myGameStatus.path.length;
		var coinsNextIndex = myGameStatus.path.length<=16 ? ((coinsCurrentIndex+diceValue) % myGameStatus.path.length): (coinsCurrentIndex+diceValue);
		if(!myGameStatus.path[coinsNextIndex])
			continue;
		var tileId = myGameStatus.path[coinsNextIndex].id;
		for(var opponentsCoin in opponentsCoins){
			if(tileId==opponentsCoins[opponentsCoin].currentPosition){
				return {coinId:coinsEligibleToMove[coin].id,tileId:tileId};
			}
		}
	}
	for (var i = 0; i < coinsEligibleToMove.length; i++) {
		var selectedCoin = coinsEligibleToMove[i];
		var coinsCurrentIndex = lodash.findIndex(myGameStatus.path,{id:selectedCoin.currentPosition});

		var coinsNextIndex = myGameStatus.path.length<=16 ? ((coinsCurrentIndex+diceValue) % myGameStatus.path.length): (coinsCurrentIndex+diceValue);
		var tile = myGameStatus.path[coinsNextIndex];
		if(!tile)
			continue;
		console.log(!isMyCoinPresent(myGameStatus.coins,tile),'--------------')
		
		if(!isMyCoinPresent(myGameStatus.coins,tile)){
			console.log({coinId:selectedCoin.id,tileId:tile.id},"*****")
			return {coinId:selectedCoin.id,tileId:tile.id};
		}
	}
	return {};
}
var isMyCoinPresent=function(coins,tile){
	for(var counter = 0;counter<coins.length;counter++){
		if(coins[counter].currentPosition == tile.currentPosition && !(tile.coins instanceof Array))
			return true;
	}
	return false;
}
module.exports = findMyDetails;
