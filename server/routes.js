var express = require('express');
var lodash = require('lodash');
var querystring = require('querystring');
var application = require('./application.js');
var operations = require('./operations.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var getGame = require('./games.js').loadGame;
var enquiries = application.enquiry;

var app=express();

var loadGame = function(req, res, next){
	req.game = getGame(req.games, req.cookies.gameId);
	next();
};

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};

var login = function(req, res, next){
	if(enquiries({question:'players'},req.game).length <= 3)
		createPlayer(req.body.name, req, res);
};

var createPlayer = function(userId,req,res){
	if(application.register(userId,req.game)){
		res.cookie('userId', userId);
		res.cookie('gameId',req.game.id);
		res.redirect('/waitingPage.html');
	}
	else
		res.redirect('/index.html')
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
	if(req.url=='/enquiry?question=whoIsTheWinner' && response!='undefined'){
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

var nameValidation = function(req,res){
	res.end(application.isValidName(req.game,req.body.name).toString());
}

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(loadGame);

app.get('^/main.html$', isPlayerRegistered);

app.use(express.static('./HTML'));

app.post('/isValidName',nameValidation);

app.post('^/login$',login);

app.use(isValidPlayer);

app.get(/^\/update/, handleUpdate);

app.get(/^\/enquiry/, handleEnquiry);

app.get(/^\/instruction/, doInstruction);


module.exports = app;
