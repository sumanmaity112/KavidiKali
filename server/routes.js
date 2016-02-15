var express = require('express');
var lodash = require('lodash');
var application = require('./application.js');
var operations = require('./operations.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlParser= require('url-parse');
var lib = require('./games.js');
var enquiries = application.enquiry;

var app=express();

var loadGame = function(req, res, next){
	req.games = lib.removeGame(req.games);
	req.game = lib.loadGame(req.games, req.cookies.gameId,req.body,req.url);
	next();
};

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	res.end('Method is not allowed');
};

var login = function(req, res, next){
	createPlayer(req.body.name, req, res);
};

var createPlayer = function(userId,req,res){
	if(application.register(userId,req.game)){
		res.cookie('userId', userId);
		res.cookie('gameId',req.game.id);
		res.redirect('/waitingPage.html');
	}
	else
		res.redirect('/kavidiKali.html')
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
	var obj = urlParser.qs.parse(req.url);
	obj.player = req.cookies.userId;
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
	if(req.url=='/enquiry?question=whoIsTheWinner' && response!='undefined'){
		req.game.resetGame(req.cookies.userId);
		res.clearCookie('userId')
		res.clearCookie('gameId');
	}
	res.end(response);
};

var isValidPlayer = function(req, res, next){
	var player = req.cookies.userId;
	if(enquiries({question:'isValidPlayer',player:player},req.game))
		next();
	else
		method_not_allowed(req, res);
};

var detailsValidation = function(req,res){
	res.end(application.checkDetails(req.games,req.body));
};

var availableGame = function(req,res){
	res.end(application.availableGame(req.games));
}

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('^/availableGame$', availableGame);

app.post('/isValidDetails',detailsValidation);

app.use(loadGame);

app.get('^/waitingPage.html$', isPlayerRegistered);

app.get('^/kavidiKali.html$', isPlayerRegistered);

app.use(express.static('./HTML'));

app.post('^/login$',login);

app.use(isValidPlayer);

app.get(/^\/update/, handleUpdate);

app.get(/^\/enquiry/, handleEnquiry);

app.get(/^\/instruction/, doInstruction);


module.exports = app;
