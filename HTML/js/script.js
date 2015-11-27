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
	var userId = document.querySelector('#userID').textContent
	var req = new XMLHttpRequest();
	console.log(req);
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
	safePlaces.forEach(function(safePlace){
		document.getElementById(safePlace).className = 'safePlace';
	});
	document.querySelector('#dice').onclick = rollDice;
};


// document.onload = function(){
// };


