var counter = 0;
var isItMyChance = function(checkLen){
	$.get('enquiry/question=isItMyChance',function(data){
		if(data=='true'){
			counter = (counter+1)%checkLen;
		}
	});
};

var moreChanceToRollDice = function(checkLen){
	$.get('enquiry/question=moreChanceToRollDice',function(data){
		if(data=='false'){
			counter = (counter+1)%checkLen;
		};
	});
};

var doHaveMoves = function(checkLen){
	$.get('enquiry/question=doHaveMoves',function(data){
		if(data=='false'){
			counter = (counter+1)%checkLen;
		}
	});
};

var checkChance = [isItMyChance, moreChanceToRollDice, doHaveMoves];

var check = function(){
	return function(){
 		return checkChance[counter](checkChance.length);
	};
}();


