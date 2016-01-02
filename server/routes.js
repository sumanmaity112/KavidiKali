var express = require('express');
var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var querystring = require('querystring');
var application = require('./application.js');
var operations = require('./operations.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var enquiries = application.enquiry;

var app=express();
var body=bodyParser.urlencoded({extended:true});

var headers = {
	".html" : "text/html",
	".svg"	: "image/svg+xml",
	".css"	: "text/css"
};

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};

// var fileNotFound = function(req, res){
// 	res.statusCode = 404;
// 	res.end('Not Found');
// 	console.log(res.statusCode);
// };

var doRedirect = function(req, res, next){
	var userId = req.body.name;
	if(enquiries({question:'players'},req.game).length <= 3)
		createPlayer(userId, req, res);
	else 
		res.end('Please wait, a game is already started');
};

var createPlayer = function(userId,req,res){
	application.register(userId,req.game);
	res.cookie('userId', userId);
	res.redirect('/waitingPage.html');
	res.end();
};

var isPlayerRegistered = function(req, res, next){
	var player = req.cookies.userId;
	if(!player || !enquiries({question:'isValidPlayer',player:player},req.game)){
		res.redirect('/index.html'); 
		res.end();
	}
	else
		next();
};

var createFunctionalObj = function(req){
	var url = req.url;
	var indexOfSlash = url.indexOf('?');
	var obj = querystring.parse(url.slice(indexOfSlash+1));
	var player = req.cookies.userId;
	obj.player = player;
	return obj;
};

var doInstruction = function(req, res, next){
	var obj = createFunctionalObj(req);
	var acknowledge = application.handleInstruction(obj,req.game);
	res.end(acknowledge);
};

var handleUpdate = function(req, res, next){
	var obj = createFunctionalObj(req);
	var update = application.handleUpdates(obj,req.game);
	res.end(update);
};

var handleEnquiry = function(req, res, next){
	var obj = createFunctionalObj(req);
	var response = enquiries(obj,req.game);	
	res.end(response);
};

var isValidPlayer = function(req, res, next){
	var player = req.cookies.userId;
	return enquiries({question:'isValidPlayer',player:player},req.game) && next() || method_not_allowed(req, res)
};

app.use(cookieParser());

app.use(body);

app.get('^/main.html$', isPlayerRegistered);

app.use(express.static('./HTML'));

app.get(/^\/update/, isValidPlayer, handleUpdate);

app.get(/^\/enquiry/, isValidPlayer, handleEnquiry);

app.get(/^\/instruction/, isValidPlayer, doInstruction);

app.post('^/login$',doRedirect)

module.exports = app;
