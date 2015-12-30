var express = require('express');
var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var querystring = require('querystring');
var application = require('./application.js');
var operations = require('./operations.js');
var cookieParser = require('cookie-parser');
var main = application.main;
var updates = operations.updates;
var enquiries = operations.enquiries;
var instructions = operations.instructions;
var getWinner = application.findWinner;

var app=express();
var headers = {
	".html" : "text/html",
	".svg"	: "image/svg+xml",
	".css"	: "text/css"
};

// var method_not_allowed = function(req, res){
// 	res.statusCode = 405;
// 	console.log(res.statusCode);
// 	res.end('Method is not allowed');
// };

// var fileNotFound = function(req, res){
// 	res.statusCode = 404;
// 	res.end('Not Found');
// 	console.log(res.statusCode);
// };

var doRedirect = function(req, res, next){
	var data = '';
	req.on('data',function(chunk){
		data+=chunk;
	});
	req.on('end',function(){
		var userId = querystring.parse(data)['name'];
		if(application.enquiry({question:'players'},req.game).length <= 3)
			createPlayer(userId, req, res);
		else 
			res.end('Please wait, a game is already started');
	});
};

var createPlayer = function(userId,req,res){
	if(!application.enquiry({question:'isValidPlayer',player:userId},req.game))
		application.register(userId,req.game);
		res.cookie('userId', userId);
		res.redirect('/waitingPage.html');
		res.end();
};

var isPlayerRegistered = function(req, res, next){
	var player = req.cookies.userId;
	if(!player || !application.enquiry({question:'isValidPlayer',player:player},req.game)){
		res.redirect('/index.html'); 
		res.end();
	}
	else
		next();
}

var serveMain = function(req, res, next){
	var filePath = './HTML' + req.url;
	var userId = req.cookies.userId;
	var color = application.findColor(userId, req.game);
	fs.readFile(filePath, function(err, data){
		if(data){
			var replaceWith = userId + '\nYour coin color : '+color;
			var html = replaceRespectiveValue(data.toString(),'__userID__',replaceWith);
			res.responseCode = 200;
			res.end(html);
			console.log(res.responseCode);
		}
		else
			next();
	});	
};

var replaceRespectiveValue = function(originalData,replaceFrom,replaceTo){
	return originalData.replace(replaceFrom,replaceTo);
};

var doInstruction = function(req, res, next){
	var obj = querystring.parse(req.url.slice(13));
	var player = req.cookies.userId;
	if(application.enquiry({question:'isValidPlayer',player:player},req.game)){
		obj.player = player;
		var result = application.handleInstruction(obj,req.game);
		res.end(result)
	}
	else
		next();
};

var handleUpdate = function(req, res, next){
	var obj = querystring.parse(req.url.slice(8));
	var player = req.cookies.userId;
	if(application.enquiry({question:'isValidPlayer',player:player},req.game)){
		obj.player = player;
		var result = application.handleUpdates(obj,req.game);
		res.end(result);
	}
	else
		next();
};

var handleEnquiry = function(req, res, next){
	var obj = querystring.parse(req.url.slice(9));
	var player = req.cookies.userId;
	if(application.enquiry({question:'isValidPlayer',player:player},req.game)){
		obj.player = player;
		var response = application.enquiry(obj,req.game);
		if(!response)
			next();
		else	
			res.end(response);
	}
	else
		next();
};

var createGameOverPage = function(req, res, next){
	var html = '<h3>Sorry Game Over  __userId__ won the game</h3>';
	html = replaceRespectiveValue(html,'__userId__',getWinner(req.game));
	res.end(html);
};
app.use(cookieParser());

app.get('^/main.html$', isPlayerRegistered, serveMain);

app.use(express.static('./HTML'));

app.get(/^\/update/,handleUpdate);

app.get(/^\/enquiry/, handleEnquiry);

app.get(/^\/instruction/,function(req, res, next){
	doInstruction(req, res, next);
});

app.get(/^\/gameOver$/,function(req, res, next){
	createGameOverPage(req, res, next);
});

app.post('^/login$',function(req, res, next){
	doRedirect(req, res, next);
});

module.exports = app;
