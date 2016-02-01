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
	var content ='';
	$.getJSON('availableGame',function(data){
		content =  '<ul>'
		data.forEach(function(value){
			if(value)
				content+='<li>'+value+'</li>';
		});
		content +='</ul>'
		var newGame = '<input type="Submit" value="newGame" id="newGame" name="option">';
		var createdDOM = newGame + content;
		$('.updateDOM').html(createdDOM);
	});
};
var removeInterval = function(){
	clearInterval(timer);
}

var changeDOM = function(){
	$('#continue').remove();
	availableGame();
}
$(document).ready(function(){
	$('#gameId').keyup(function(){
		var urlData = 'name='+$('#name').val()+'&gameId='+$('#gameId').val();
		$.post('isValidDetails',urlData,function(data){
			data = JSON.parse(data);
			validName = data.name;
			validGameId = data.gameId;
		});
	});
})
