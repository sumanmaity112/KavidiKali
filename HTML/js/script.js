function makeGrid(){
	var table='<table border="3px" width="500px">'
	for(var i=4;i>=0;i--){
		table+='<tr height="100px" width="100px">';
		for(var j=0;j<5;j++){
			table+='<td id="'+j+','+i+'"onclick="print(this.id)"></td>';
		};
		table+='</tr>'
	};
	table+='</table></br><button  class="button">Dice</button>';
	document.getElementById("table").innerHTML = table;
	document.getElementById('4,2').bgColor = "#B078B2";
	document.getElementById('2,4').bgColor = "#B078B2";
	document.getElementById('2,2').bgColor = "white";
	document.getElementById('0,2').bgColor = "#B078B2";
	document.getElementById('2,0').bgColor = "#B078B2";
};

function print(x){
	alert('x is clicked'+x);
};