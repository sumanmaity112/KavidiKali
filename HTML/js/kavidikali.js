var selectedCoin;
var currentStateOfGame;
var activeTiles, refreshWindow, updateValues;

var rotatePoint = function(x, y, length){
	var newX = length-y;
	var newY = x;
	return [newX,newY]
}

var getPoint = function(x, y, rotateCount) {
	var newY = y;
	var newX = x;
	for(var i =0; i<rotateCount; i++){
		var points = rotatePoint(newX, newY, 4);
		newX = points[0];
		newY = points[1];
	}
	return [newY,newX].join(',');
}

var createGrid = function(rotateCount){
	var table='<table class="grid">'
	for(var rowCount=5;rowCount>=-1;rowCount--){
		var row = '<tr>';
		for(var columnCount=-1;columnCount<6;columnCount++)
			row+='<td id="'+getPoint(rowCount, columnCount, rotateCount)+'" class="tile" ></td>';
		row += '</tr>';
		table += row;
	};
	table+='</table>';
	return table;
};

var coinToDOMElement = function(coin) {
	return '<div class="coin "'+coin.colour+' id="'+coin.id+'">';
};

var coinsThatHaveMoved=function(oldStatus,newStatus) {
	if(!oldStatus)
		return Object.keys(newStatus);
	return Object.keys(oldStatus).filter(function(coinId){
		return oldStatus[coinId].currentPosition!=newStatus[coinId].currentPosition;
	});
};

var removeCoinsFromOldPositions = function(coinsToBeErased){
	coinsToBeErased.forEach(function(coinId) {
		$("#"+coinId).remove();
	});
};

var placeCoinsInCurrentPosition=function(stateOfGame,coinsToBeUpdated){
	coinsToBeUpdated.forEach(function(coinId) {
		var coin=stateOfGame[coinId];
		placeCoin(coin);
	});
};

var placeCoin = function(coin){
	if(coin.currentPosition == -1)
		document.getElementById(coin.colour+'_yard').innerHTML+=coinToDOMElement(coin);
	else
		document.getElementById(coin.currentPosition).innerHTML+=coinToDOMElement(coin)
};

var coinClick = function(){
	selectedCoin = this.id;
	$.get('enquiry?question=movesWhere&coin='+selectedCoin,function(data){
		activeTiles = JSON.parse(data);
		for(var pos in activeTiles){
			document.getElementById(activeTiles[pos]).onclick = tileClick;
		};
	});
};

var refreshBoard = function(){
	$.getJSON('update?toUpdate=board',function(data,status){
		var stateOfGame = data;
		var coinsToBeUpdated = coinsThatHaveMoved(currentStateOfGame,stateOfGame);
		removeCoinsFromOldPositions(coinsToBeUpdated);

		placeCoinsInCurrentPosition(stateOfGame,coinsToBeUpdated);
		currentStateOfGame=stateOfGame;
		var coins = $('.coins');
		for(var i=0; i<coins.length;i++){
			coins[i].onclick = coinClick;
		}; 
	});
};


window.onload = function(){
	$('.playArea').html(createGrid(0));
	var safeTiles = ['4,2','2,4','2,2','0,2','2,0'];
	var outerLoop = ['-1,5','0,5','1,5','2,5','3,5','4,5','5,5','-1,4','-1,3','-1,2','-1,1','-1,0','-1,-1',
					'0,-1','1,-1','2,-1','3,-1','4,-1','5,-1','5,0','5,1','5,2','5,3','5,4','5,5'];
	var yards = ['2,-1','5,2','2,5','-1,2'];
	safeTiles.forEach(function(safeTile){
		document.getElementById(safeTile).className += ' safeTile';
	});
	outerLoop.forEach(function(tile){
		document.getElementById(tile).className += ' outerTile';
	});
	var colorSequence=["red","green","blue","yellow"];
	yards.forEach(function(place,index){
		document.getElementById(place).className = 'parking';
		document.getElementById(place).id = colorSequence[index]+'_yard';
	});
	refreshWindow = setInterval(function(){
			refreshBoard();
		},500);
}