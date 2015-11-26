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
	document.getElementById('4,2').bgColor = "#76D8FF"
	document.getElementById('2,4').bgColor = "#76D8FF"
	document.getElementById('2,2').bgColor = "#76D8FF"
	document.getElementById('0,2').bgColor = "#76D8FF"
	document.getElementById('2,0').bgColor = "#76D8FF"
};

function print(x){

	alert('x is clicked'+x);
}