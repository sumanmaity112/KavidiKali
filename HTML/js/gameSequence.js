var counter = 0;
var isItMyChance = function(checkLen){
	 // $.ajax({
  //       url: 'enquiry/question=isItMyChance',
  //       success: function (result) {
  //       	console.log(result.message,"=================OK")
  //           if (result.isOk) {
  //           	if(result.message=='true'){
  //           		document.querySelector('#dice').onclick = rollDice;
		// 			counter = (counter+1)%checkLen;
  //          		};
  //           };
  //       },
  //       async: false
  //   });
	var request = $.ajax({
		  url: 'enquiry/question=isItMyChance',
		  method: "GET"
	});
	 
	request.done(function( msg, success, obj ) {
		console.log('============================================================================ msg',obj.responseText);
		document.querySelector('#dice').onclick = rollDice;
		counter = (counter+1)%checkLen;
	});


	// $.get(,function(data){
	// 		console.log(data,"=============================",counter)
	// 	if(data=='true'){
	// 		document.querySelector('#dice').onclick = rollDice;
	// 		counter = (counter+1)%checkLen;
	// 	}
	// });
};

var moreChanceToRollDice = function(counter,checkLen){
	$.get('enquiry/question=moreChanceToRollDice',function(data){
		console.log(data,"=====================")
		if(data=='false'){
			document.querySelector('#dice').onclick = null;
			counter = (counter+1)%checkLen;
		};
	});
};

var doHaveMoves = function(counter,checkLen){
	$.get('enquiry/question=doHaveMoves',function(data){
			alert('hai......................')
		if(data=='false'){
			counter = (counter+1)%checkLen;
		}
	})
};


var checkChance = [isItMyChance, moreChanceToRollDice, doHaveMoves];

var check = function(){
	// var counter=0;
	return function(){
		console.log('===============================================================',counter);
 		return checkChance[counter](checkChance.length);
	};
}();


