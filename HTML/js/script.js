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
	var userId = document.querySelector('#userID').textContent
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	    if (req.readyState == 4 && req.status == 200) {
	    	alert(req.responseText);
	    };
	};
	req.open('POST', 'dice', true);
	req.send('{"player":"'+userId+'","action":"rollDice"}');
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
};


// document.onload = function(){
// };


