var express = require('express');
var lodash = require('lodash');
var application = require('./application.js');
var operations = require('./operations.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlParser = require('url-parse');
var lib = require('./games.js');
var enquiries = application.enquiry;
var botPlayer = require('../javascript/bot/botPlayer.js');

var app = express();

var loadGame = function (req, res, next) {
    req.games = lib.removeGame(req.games);
    req.game = lib.loadGame(req.games, req.cookies.gameId, req.body, req.url);
    next();
};

var method_not_allowed = function (req, res) {
    res.statusCode = 405;
    res.end('Method is not allowed');
};

var login = function (req, res, next) {
    createPlayer(req.body.name, req, res);
    if (req.body.playWithBot == 'true') {
        var noOfBot = (+req.body.noOfBotPlayers);
        connectToBot(req.game.id, noOfBot);
    }
    res.send();
};

var connectToBot = function (gameId, noOfBot) {
    for (var counter = 0; counter < noOfBot; counter++)
        (new botPlayer(gameId)).start();
};

var createPlayer = function (userId, req, res) {
    if (application.register(userId, req.game)) {
        res.cookie('userId', userId);
        res.cookie('gameId', req.game.id);
        res.redirect('/waitingPage.html');
    }
    else
        res.redirect('/index.html');
    res.end();
};

var isPlayerRegistered = function (req, res, next) {
    var player = req.cookies.userId;
    if (!player || !enquiries({question: 'isValidPlayer', player: player}, req.game)) {
        res.redirect('/index.html');
        res.end();
    }
    else
        next();
};

var isPlayerCanPlay = function (req, res, next) {
    if (application.isGameReady(req.game))
        next();
    else {
        res.redirect('/waitingPage.html');
        res.end();
    }
}

var createFunctionalObj = function(req, key){
	var obj = urlParser.qs.parse(req.url);
	var parsedData = urlParser.qs.parse(obj[key]);
	lodash.merge(obj, parsedData);
	obj.player = req.cookies.userId;
	return obj;
};

var doInstruction = function(req, res, next){
	var obj = createFunctionalObj(req, "/instruction");
	var acknowledge = application.handleInstruction(obj,req.game);
	res.end(acknowledge);
};

var handleUpdate = function(req, res, next){
	var obj = createFunctionalObj(req, "/update");
	var update = application.handleUpdates(obj,req.game);
	res.end(update);
};

var handleEnquiry = function(req, res, next){
	var obj = createFunctionalObj(req, "/enquiry");
	var response = enquiries(obj,req.game);
	if(req.url=='/enquiry?question=whoIsTheWinner' && response!='undefined'){
		req.game.resetGame(req.cookies.userId);
		res.clearCookie('userId');
		res.clearCookie('gameId');
	}
	res.end(response);
};

var isValidPlayer = function (req, res, next) {
    var player = req.cookies.userId;
    if (req.game && enquiries({question: 'isValidPlayer', player: player}, req.game))
        next();
    else
        method_not_allowed(req, res);
};

var availableGame = function (req, res) {
    res.end(application.availableGame(req.games));
};

var newGames = function (req, res) {
    res.end(application.newGames(req.games));
};

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));

app.use(loadGame);

app.get('^/availableGame$', availableGame);

app.get('^/newGames$', newGames);

app.get('^/waitingPage.html$', isPlayerRegistered);

app.get('^/kavidiKali.html$', isPlayerRegistered, isPlayerCanPlay);

app.use(express.static('./HTML'));

app.post('^/login$', login);

app.use(isValidPlayer);

app.get(/^\/update/, handleUpdate);

app.get(/^\/enquiry/, handleEnquiry);

app.get(/^\/instruction/, doInstruction);


module.exports = app;
