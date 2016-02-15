var selectedCoin;
var currentStateOfGame;
var activeTiles, refreshWindow, updateValues;
var prev_note = '';
var myCoinColor;

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
	return '<div class="coin coins_'+coin.colour+'" id="'+coin.id+'">';
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
	$.getJSON('enquiry?question=movesWhere&coin='+selectedCoin,function(data,status){
		activeTiles = data;
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

var refreshBoard = function(){
	$.getJSON('update?toUpdate=board',function(data,status){
		var stateOfGame = data;
		var coinsToBeUpdated = coinsThatHaveMoved(currentStateOfGame,stateOfGame);
		removeCoinsFromOldPositions(coinsToBeUpdated);

		placeCoinsInCurrentPosition(stateOfGame,coinsToBeUpdated);
		currentStateOfGame=stateOfGame;
		var coins = $('.coin');
		for(var i=0; i<coins.length;i++){
			coins[i].onclick = coinClick;
		};
	});
};

var appendCoins = function(element, count){
	var html = ''
	for (var i = 0; i < 4; i++) {
		if(i<count){
			html += '<div class="coins_'+myCoinColor+' filledCoin"></div>';
		}
		else
		html += '<div class="coinRep"></div>';
	};
	element.html(html);
}

var myInfo = function(){
	$.getJSON('enquiry?question=myInfo',function(data){
		var id = data.id;
		myCoinColor = data.coins[id+"1"].colour;
		var coinsOnBoard = 0;
		var coinsReachedDestination = 0;
		var coins = data.coins;
		for(coin in coins){
			if(coins[coin].reachedDestination){
				coinsReachedDestination++;
			}
			if(coins[coin].currentPosition!=-1){
				coinsOnBoard ++;
			}
		}
		appendCoins($('#reachedDestination'),coinsReachedDestination);
		appendCoins($('#enterBoard'),coinsOnBoard);
		var firstCut = data.matured ? 'Done' : 'Pending'
		$('#firstCut').html(firstCut);
	});
};


var notification = function(){
	$.get('update?toUpdate=notification',function(data, status){
		if(data){
			if(data!=prev_note){
				prev_note = data;
				$(data).prependTo("#notifications");
			}
		}
	});
};

var getRotatedPoint = function(id, length){
	var coordinates = id.split(',');
	return getPoint(coordinates[0],coordinates[1],length);
};

var rotateList = function(list, rotateCount){
	var temp = list.slice(0,rotateCount)
	return list.slice(rotateCount).concat(temp);
};


var getPlayerDiv = function(player, colour){
	var container = document.createElement("li");
	container.className = "player_container";
	container.innerHTML = '<span class="player" id="list_'+player+'">'+toNameCase(player)+'</span>';
	container.innerHTML += '<div class="colour" id="'+colour+'_box"></div>'
	return container;
};

var setInfo = function(){
	$.getJSON('enquiry?question=whatIsMyDetails',function(data){
		var self = data.name;
		$.getJSON('enquiry?question=players',function(list){
			list.forEach(function(player){
					$('.players').append(getPlayerDiv(player.name, player.colour));
			});
		});
		$('#myName').html(self.toUpperCase());
	})
};

var toNameCase = function(name){
	var splittedName = name.split(" ");
	return splittedName.map(function(namePart){
		return namePart[0].toUpperCase()+namePart.slice(1);
	}).join(" ")
};

var currentPlayer = function(){
	$.get('enquiry?question=currentPlayer',function(player,status){
		$('.current_player').removeClass('current_player');
		$('#list_'+player).addClass('current_player');
	});
};

var rollDice = function(){
	$.get('instruction?action=rollDice',function(data){
		document.querySelector('#last_dice_value').innerHTML = data;
	});
};

var makeDiceValue = function(value){
	return '<span class="diceValue">'+value+'</span>'
};

var updateDiceValues = function(){
	$.getJSON('update?toUpdate=diceValues',function(data,status){
		var diceValues = '';
		data.forEach(function(diceValue){
			diceValues += "	"+makeDiceValue(diceValue);
		});
		document.querySelector('#diceValues').innerHTML = diceValues;
	});
};
var restore = function(){
	$.get('enquiry?question=isGameOver',function(data){
		if(data=='true'){
			$.get('enquiry?question=whoIsTheWinner',function(data){
				$('Sorry gameover '+data+' won the game').prependTo("#notifications");
				clearInterval(refreshWindow);
				clearInterval(updateValues);
			});
		};
	});
};

window.onload = function(){
	$.get('enquiry?question=playerTurn',function(data, status){
		$('.board').html(createGrid(+data));
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

		yards.forEach(function(place, index){
			document.getElementById(place).className = 'parking';
			document.getElementById(place).id = colorSequence[index]+'_yard';
		});
	});

	setInfo();
	$('#dice').click(rollDice);
	refreshWindow = setInterval(function(){
			currentPlayer();
			refreshBoard();
			notification();
			restore();
			updateDiceValues();
			myInfo();
		},500);
}
