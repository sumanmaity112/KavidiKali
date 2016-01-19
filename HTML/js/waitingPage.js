window.onload = function(){
	$.getJSON('enquiry?question=whatIsMyDetails',function(data, status){
		if(data){
			var text  = document.querySelector('#userId').innerHTML;
			document.querySelector('#userId').innerHTML = [data.name, text,'to gameId  ',data.gameId].join(' ');
		}
	});
	var timer = setInterval(function(){
		$.get('update?toUpdate=waitingPage',function(data,status){
			if(data)
				document.getElementById('noOfPlayers').innerHTML = data;
			else{
				clearInterval(timer);
				$(location).attr('href','/main.html');
			}
		})
	},1000);
};