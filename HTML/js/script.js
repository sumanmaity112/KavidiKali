var playerSequence = ['red','yellow','green','blue'];
var players = {};

var Player = function(name, color, starting_position){
	this.name = name;
	this.color = color;
	this.starting_position = starting_position;
};

var Coin = function(name, color, )
function makeGrid(){
	var table='<table class="grid">'
	for(var i=5;i>=-1;i--){
		var row = '<tr>';
		for(var j=-1;j<6;j++)
			row+='<td id="'+j+','+i+'" class="tile" onclick="print(this.id)"></td>';
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

var refreshBoard = function(){
	$.get('update/toUpdate=board',function(data,status){
		var coins = parseQueryString(data);
		Object.keys(coins).forEach(function(coin){
				if(coins[coin])
					document.getElementById(coins[coin]).innerHTML += '<img src="./../svg/blue_coin.svg">';
				else
					document.getElementById('2,5').innerHTML += '<img src="./../svg/blue_coin.svg" class="coins" id="'+coin+'"">';
		});
		$('.coins').on('click',function(){
			alert('yeeehaaa');
		});
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
	})
	document.querySelector('#dice').onclick = rollDice;
	document.querySelector('#updateDice').onclick = updateDiceValues;
	document.querySelector('#refreshBoard').onclick = refreshBoard;

};

