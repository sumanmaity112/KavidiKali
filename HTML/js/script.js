function makeGrid(){
	var table='<table class="grid">'
	for(var i=4;i>=0;i--){
		var row = '<tr>';
		for(var j=0;j<5;j++)
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

window.onload = function(){
	document.getElementById("board").innerHTML = makeGrid();
	var safePlaces = ['4,2','2,4','2,2','0,2','2,0'];
	safePlaces.forEach(function(safePlace){
		document.getElementById(safePlace).className = 'safePlace';
	});
	document.querySelector('#dice').onclick = rollDice;
	document.querySelector('#updateDice').onclick = updateDiceValues;
};

