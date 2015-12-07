var playerSequence = ['red','yellow','green','blue'];
var players = {};
var currentStateOfGame;

var Player = function(name, color, starting_position){
	this.name = name;
	this.color = color;
	this.starting_position = starting_position;
};

function makeGrid(){
	var table='<table class="grid">'
	for(var rowCount=5;rowCount>=-1;rowCount--){
		var row = '<tr>';
		for(var columnCount=-1;columnCount<6;columnCount++)
			row+='<td id="'+columnCount+','+rowCount+'" class="tile" onclick="print(this.id)"></td>';
		row += '</tr>';
		table += row;
	};
	table+='</table>';
	return table;
};

function print(x){
	alert('x is clicked'+x);
};

var rollDice = function(){
	$.post('instruction',{"action":"rollDice"},function(data,status){
		updateDiceValues();
	});
};

var updateDiceValues = function(){
	$.get('update/toUpdate=diceValues',function(data,status){
		document.querySelector('#diceValues').innerHTML = data;
	});
};

var parseQueryString = function( queryString ) {
    var params = {};
    var queries = queryString.split("&");
    for ( var i = 0, l = queries.length; i < l; i++ ) {
    	var temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    };
    return params;
};

var coinToDOMElement = function(coin) {
	var coinImage=coin.colour+"_coin.svg";
	return '<img src="/svg/'+coinImage+'" class="coins" id="'+coin.id+'">';
}

var coinsThatHaveMoved=function(oldStatus,newStatus) {
	if(!oldStatus)
		return Object.keys(newStatus);
	return Object.keys(oldStatus).filter(function(coinId){
		return oldStatus[coinId].currentPosition!=newStatus[coinId].currentPosition;
	});
}

var placeCoinsInCurrentPosition=function(stateOfGame,coinsToBeUpdated){
	coinsToBeUpdated.forEach(function(coinId) {
		var coin=stateOfGame[coinId];
		document.getElementById(coin.currentPosition).innerHTML+=coinToDOMElement(coin)
	});
};

var refreshBoard = function(){
	$.get('update/toUpdate=board',function(data,status){
		var stateOfGame = JSON.parse(data);
		var coinsToBeUpdated = coinsThatHaveMoved(currentStateOfGame,stateOfGame);
		// removeCoinsFromOldPositions(currentStateOfGame,coinsToBeUpdated);
		placeCoinsInCurrentPosition(stateOfGame,coinsToBeUpdated);
		currentStateOfGame=stateOfGame;
	});
};

var getPlayers = function(){
	$.get('enquiry/question=players',function(data,status){

	});
};

window.onload = function(){
	document.getElementById("board").innerHTML = makeGrid();
	var safePlaces = ['4,2','2,4','2,2','0,2','2,0'];
	var outerLoop = ['-1,5','0,5','1,5','2,5','3,5','4,5','5,5','-1,4','-1,3','-1,2','-1,1','-1,0','-1,-1',
					'0,-1','1,-1','2,-1','3,-1','4,-1','5,-1','5,0','5,1','5,2','5,3','5,4','5,5'];
	var playerCoins = ['2,5','5,2','2,-1','-1,2'];
	safePlaces.forEach(function(safePlace){
		document.getElementById(safePlace).className = 'safePlace';
	});
	outerLoop.forEach(function(tile){
		document.getElementById(tile).className = 'outerTile'
	});
	playerCoins.forEach(function(place){
		document.getElementById(place).className = 'parking';
	});
	setInterval(function(){
		$.get('update/toUpdate=board',function(data,status){
			var stateOfGame = JSON.parse(data);
			var coinsToBeUpdated = coinsThatHaveMoved(currentStateOfGame,stateOfGame);
			// removeCoinsFromOldPositions(currentStateOfGame,coinsToBeUpdated);
			placeCoinsInCurrentPosition(stateOfGame,coinsToBeUpdated);
			currentStateOfGame=stateOfGame;
		});
	},500); 
	document.querySelector('#dice').onclick = rollDice;
	document.querySelector('#updateDice').onclick = updateDiceValues;
};

