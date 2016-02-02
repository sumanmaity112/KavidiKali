var update;

window.onload = function(){
	$('#continue').click(hideUserInfo); 
	$('#createGame_button').click(createGame);
};

var hideUserInfo = function(){
	$('.userInfo').addClass('hidden');
	$('.selectGame').removeClass('hidden');
	update = setInterval(updateAvailableGames, 1000);
};

var createGame = function(){
	var playerName = $('#name').val();
	var obj = {};
	obj.name = playerName;
	obj.option = 'newGame';
	var form = createForm(obj, 'POST', 'login');
	clearInterval(update);
	form.submit();
};

var createForm = function(obj, method, action){
	var keys = Object.keys(obj);
	var form = document.createElement('form');
	var node = document.createElement("input");
	for (var i = 0; i < keys.length; i++) {
		node.name = keys[i];
		node.value = obj[keys[i]];
		form.appendChild(node.cloneNode());
	};
	form.method = method;
	form.action = action;
	form.style.display = "none";
	return form;
};

var updateAvailableGames = function(){
	$.getJSON('availableGame',function(data){
		var gameIds = Object.keys(data);
		var heading = '<tr><th>GAME</th><th>Player 1</th><th>Player 2</th><th>Player 3</th></tr>'
		var rows = gameIds.map(function(gameId){
			return createRow(gameId, data[gameId]);
		})
		$('#availableGames').html(heading+rows.join(" "));	
	});
};

var createRow = function(key, values){
	var row = '<tr id="'+key+'" class="games" onClick="joinGame(this.id)">';
	row += createRowData(key);
	for (var i = 0; i < 3; i++) {
		row += createRowData(values[i] || '');
	};
	row += '</tr>'
	return row;
};

var createRowData = function(text){
	return '<td>'+text+'</td>';
};

var joinGame = function(id){
	var playerName = $('#name').val();
	var obj = {};
	obj.name = playerName;
	obj.option = 'joinGame';
	obj.gameId = id;
	var form = createForm(obj, 'POST', 'login');
	form.submit();
};
