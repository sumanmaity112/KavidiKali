var result=false;

var check = function(){
	return result;
};

$(document).ready(function(){
	$('#name').change(function(){
		$.post('isValidName','name='+$('#name').val(),function(data){
			if(data!='true')
				result = false;
			else
				result=true;
		});
	});
})