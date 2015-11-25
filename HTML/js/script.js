function makeGrid(){
	var table='<table border="3px" width="500px">'
	for(var i=0;i<5;i++){
		table+='<tr height="100px" width="100px">';
		for(var j=0;j<5;j++){
			table+='<td id="'+i+','+j+'"></td>';
		};
		table+='</tr>'
	};
	table+='</table>';
	document.getElementById("table").innerHTML = table;
};