var lodash = require('lodash');

var op1 = function(i,j){
	var result = i+','+j;
	return result;
};
var op2 = function(i,j){
	var result = j+','+i;
	return result;
};

function generate(start,size){
	var count = 0, operation = [op1,op2];        																			
	var path = [], j = start, i = start;
	do{
		var value = operation[count](j,i)
		if(value == path[0]) {
			j = size;
			i++
			count++
			value = operation[count](j,i);
		}
		path.push(value);
		i = ((i+1)%(size+1)) || start
	}while(path.length < ((size-start)*2)+1 );
	return path;
};

function reverseList(list){
	return list.map(function(item){
		return item.split('').reverse().join('');
	}).reverse();
};

function wrapArray(list,start){
	var start = lodash.intersection(list,start);
	if(start){
		var secList = list.splice(list.indexOf(start[0]));
		return secList.concat(list)
	};
	return list;
};

var generateRoute = function(initial,size){
	var list = generate(initial,size)
	var list1 = reverseList(list.slice(1,-1));
	return list.concat(list1);;
};

function getNeighbours(point){
	var points = point.split(',');
	var x = +points[0];
	var y = +points[1];
	return[[x,y+1],[x+1,y],[x-1,y],[x,y-1]].map(function(each){
		return each.join();
	});
};

var generatePath = function(start){
	var size = 4;
	var count = 0;
	var path = [];
	for(var initial = 0,startings = [start] ; initial<=size ; 
			initial++,size--,startings=getNeighbours(list[0]),count = (count+1)%2){
		var list = wrapArray(generateRoute(initial,size),startings);
		list = count && list.reverse() || list;
		path.push(list);
	}	
	return lodash.flatten(path);
};

exports.generateFullPath = generatePath;
exports.generateHalfPath = function(start){
	return wrapArray(generateRoute(0,4),[start]);
};





