var validGameId = true, validName=true,timer;
var alertPlayer=function(){
	if(!validGameId)
		return alert('Check entered gameId');
	if(!validName)
		return alert('Entered another name');
}
var check = function(){
	alertPlayer();
	return validGameId && validName;
};

var enable=function(){
	$("#gameId").prop('disabled', false);
};

var disable=function(){
	$("#gameId").prop('disabled', true);
};
var availableGame = function(){
	$.getJSON('availableGame',function(data){
		var content = '';
		data.forEach(function(value){
			if(value)
				content+='<option value="'+value+'">'+value+'</option>';
		});
		$('#gameId').html(content);
	});
};
var removeInterval = function(){
	clearInterval(timer);
}
$(document).ready(function(){
	availableGame();
	disable();
	$('#gameId').keyup(function(){
		var urlData = 'name='+$('#name').val()+'&gameId='+$('#gameId').val();
		$.post('isValidDetails',urlData,function(data){
			data = JSON.parse(data);
			validName = data.name;
			validGameId = data.gameId;
		});
	});
	document.querySelector('#joinGame').onclick=enable;
	document.querySelector('#newGame').onclick=disable;
	document.querySelector('#gameId').onclick = removeInterval;
	timer = setInterval(function(){
		availableGame();
	},2000);
})