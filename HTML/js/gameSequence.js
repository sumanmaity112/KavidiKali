var isItMyChance = function(counter,checkLen){
	$.get('enquiry/question=isItMyChance',function(data){
		if(data=='true'){
			document.querySelector('#dice').onclick = rollDice;
			counter = (counter+1)%checkLen;
		}
	});
};

var moreChanceToRollDice = function(counter,checkLen){
	$.get('enquiry/question=moreChanceToRollDice',function(data){
		if(data=='false'){
			document.querySelector('#dice').onclick = null;
			counter = (counter+1)%checkLen;
		};
	});
};

var doHaveMoves = function(counter,checkLen){
	$.get('enquiry/question=doHaveMoves',function(data){
		if(data=='false')
			counter = (counter+1)%checkLen;
	})
};


var checkChance = [isItMyChance,moreChanceToRollDice,doHaveMoves];

var check = function(){
	var counter=0;
	return function(){
		return checkChance[counter](counter, checkChance.length);
	};
}();


