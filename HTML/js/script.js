var selectedCoin;
var currentStateOfGame;
var activeTiles, refreshWindow, updateValues;
var turnTemplate = "Its __UserID__'s turn "


function makeGrid(){
	var table='<table class="grid">'
	for(var rowCount=5;rowCount>=-1;rowCount--){
		var row = '<tr>';
		for(var columnCount=-1;columnCount<6;columnCount++)
			row+='<td id="'+columnCount+','+rowCount+'" class="tile" ></td>';
		row += '</tr>';
		table += row;
	};
	table+='</table>';
	return table;
};

var myName = function(){
	$.get('enquiry?question=myNameAndColor',function(data, status){
		if(data){
			document.querySelector('#userId').innerHTML=data;
		}
	});
};

var rollDice = function(){
	$.get('instruction?action=rollDice');
};

var updateDiceValues = function(){
	$.get('update?toUpdate=diceValues',function(data,status){
		document.querySelector('#diceValues').innerHTML = data;
	});
};

var currentPlayer = function(){
	$.get('enquiry?question=currentPlayer',function(data,status){
		var html = turnTemplate.replace('__UserID__',data);
		document.querySelector('#playerTurn').innerHTML=html;
	});
}

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
		placeCoin(coin);
	});
};

var placeCoin = function(coin){
	if(coin.currentPosition == -1)
		document.getElementById(coin.colour+'_yard').innerHTML+=coinToDOMElement(coin);
	else
		document.getElementById(coin.currentPosition).innerHTML+=coinToDOMElement(coin)
};

var removeCoinsFromOldPositions = function(coinsToBeErased){
	coinsToBeErased.forEach(function(coinId) {
		$("#"+coinId).remove();
	});
} 

var refreshBoard = function(){
	$.get('update?toUpdate=board',function(data,status){
		var stateOfGame = JSON.parse(data);
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

var coinClick = function(){
	selectedCoin = this.id;
	$.get('enquiry?question=movesWhere&coin='+selectedCoin,function(data){
		activeTiles = JSON.parse(data);
		for(var pos in activeTiles){
			document.getElementById(activeTiles[pos]).onclick = tileClick;
		};
	});
};

var tileClick = function(){
	if(selectedCoin){
		$.get('instruction?action=moveCoin&coin='+selectedCoin+'&position='+this.id,function(data){
			selectedCoin = undefined;
			for(var pos in activeTiles){
				document.getElementById(activeTiles[pos]).onclick = null;
			};
			activeTiles=undefined;
		});
	};
};

var restore = function(){
	$.get('enquiry?question=isGameOver',function(data){
		if(data=='true'){
			$.get('enquiry?question=whoIsTheWinner',function(data){
				clearInterval(refreshWindow);
				clearInterval(updateValues);
				document.querySelector("#playerTurn").innerHTML = '<h3>Sorry Game Over  '+data+' won the game</h3>';
			});
		}
	});
};

window.onload = function(){
	document.getElementById("board").innerHTML = makeGrid();
	var safePlaces = ['4,2','2,4','2,2','0,2','2,0'];
	var outerLoop = ['-1,5','0,5','1,5','2,5','3,5','4,5','5,5','-1,4','-1,3','-1,2','-1,1','-1,0','-1,-1',
					'0,-1','1,-1','2,-1','3,-1','4,-1','5,-1','5,0','5,1','5,2','5,3','5,4','5,5'];
	var yards = ['2,-1','5,2','2,5','-1,2'];
	safePlaces.forEach(function(safePlace){
		document.getElementById(safePlace).className = 'safePlace';
	});
	outerLoop.forEach(function(tile){
		document.getElementById(tile).className = 'outerTile'
	});
	var colorSequence=["red","green","blue","yellow"];
	yards.forEach(function(place,index){
		document.getElementById(place).className = 'parking';
		document.getElementById(place).id = colorSequence[index]+'_yard';
	});
	myName();
	refreshWindow = setInterval(function(){
		refreshBoard();
		currentPlayer();
		restore();
		updateDiceValues();
	},500); 
	document.querySelector('#dice').onclick = rollDice;	
};
