var lodash = require('lodash');

var Dice = function(values){
	this.values = values;
};

Dice.prototype = {
	roll : function(){
		return lodash.sample(this.values);
	}
}

module.exports = Dice;