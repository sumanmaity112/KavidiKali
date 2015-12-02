var lodash = require('lodash');

var operation1 = function(x,y){
	return (x+','+y);
};
var operation2 = function(x,y){
	return (y+','+x);
};

var generatePath = function (start,size){
	var count = 0, operations = [operation1,operation2];        																			
	var path = [], y = start, x = start;
	do{
		var value = operations[count](y,x);
		if(value == path[0]) {
			y = size, x++, count++;
			value = operations[count](y,x);
		}
		path.push(value);
		x = ((x+1)%(size+1)) || start;
	}while(path.length <= (size-start)*2);
	return path;
};

var reverseList = function (list){
	return list.map(function(item){
		return item.split('').reverse().join('');
	}).reverse();
};

var wrapArray = function (list,start){
	var start = lodash.intersection(list,start);
	return start ? list.splice(list.indexOf(start[0])).concat(list) : list;
};

var generateRoute = function(initial,size){
	var list = generatePath(initial,size);
	var list1 = reverseList(list.slice(1,-1));
	return list.concat(list1).reverse();
};

var getNeighbours = function (point){
	var points = point.split(',');
	var x = +points[0], y = +points[1];
	return[[x,y+1],[x+1,y],[x-1,y],[x,y-1]].map(function(each){
		return each.join();
	});
};

exports.generateFullPath = function(start){
	var size = 4, count = 0, path = [];
	for(var initial = 0,startings = [start] ; initial<=size ; 
			initial++,size--,startings=getNeighbours(list[0]),count = (count+1)%2){
		var list = wrapArray(generateRoute(initial,size),startings);
		list = count && list.reverse() || list;
		path.push(list);
	}	
	return lodash.flatten(path);
};

exports.generateHalfPath = function(start){
	return wrapArray(generateRoute(0,4),[start]);
};