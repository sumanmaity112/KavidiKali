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
var messages = require('./messages');
var staticPageRoutes = require('./staticPageRoutes.js')

var app = express();

var loadGame = function(req, res, next) {
    req.games = lib.removeGame(req.games);
    req.game = lib.loadGame(req.games, req.cookies.gameId, req.body, req.url);
    next();
};

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var sendErrorPageWithCode = function(res, errorCode, message) {
    res.statusCode = errorCode;
    staticPageRoutes.serverErrorPage(res, {
        message
    });
};

var login = function(req, res, next) {
    if (!req.game)
        sendErrorPageWithCode(res, 404, messages.checkUrl);
    else if (req.game.isFull())
        sendErrorPageWithCode(res, 400, messages.gameAlreadyStarted);
    else if (application.register(req.body.name, req.game))
        redirectWithSettingCookie(req, res);
    else
        res.redirect('/index.html');

    req.body.playWithBot == 'true' &&
        connectToBot(req.game.id, +req.body.noOfBotPlayers);
};

var connectToBot = function(gameId, noOfBot) {
    for (var counter = 0; counter < noOfBot; counter++)
        (new botPlayer(gameId)).start();
};


var redirectWithSettingCookie = function(req, res) {
    res.cookie('userId', req.body.name);
    res.cookie('gameId', req.game.id);
    res.redirect('/waitingPage.html');
};

var isPlayerRegistered = function(req, res, next) {
    var player = req.cookies.userId;
    if (!player || !enquiries({
            question: 'isValidPlayer',
            player: player
        }, req.game))
        res.redirect('/index.html')
    else
        next();
};

var isPlayerCanPlay = function(req, res, next) {
    if (application.isGameReady(req.game))
        next();
    else
        res.redirect('/waitingPage.html');
};

var createFunctionalObj = function(req, key) {
    var obj = urlParser.qs.parse(req.url);
    var parsedData = urlParser.qs.parse(obj[key]);
    lodash.merge(obj, parsedData);
    obj.player = req.cookies.userId;
    return obj;
};

var doInstruction = function(req, res, next) {
    var obj = createFunctionalObj(req, "/instruction");
    var acknowledge = application.handleInstruction(obj, req.game);
    res.end(acknowledge);
};

var handleUpdate = function(req, res, next) {
    var obj = createFunctionalObj(req, "/update");
    var update = application.handleUpdates(obj, req.game);
    res.end(update);
};

var handleEnquiry = function(req, res, next) {
    var obj = createFunctionalObj(req, "/enquiry");
    var response = enquiries(obj, req.game);
    if (req.url == '/enquiry?question=whoIsTheWinner' && response != 'undefined') {
        req.game.resetGame(req.cookies.userId);
        res.clearCookie('userId');
        res.clearCookie('gameId');
    }
    res.end(response);
};

var isValidPlayer = function(req, res, next) {
    var player = req.cookies.userId;
    if (req.game && enquiries({
            question: 'isValidPlayer',
            player: player
        }, req.game))
        next();
    else
        sendErrorPageWithCode(res, 405, messages.methodNotAllowed);
};

var availableGame = function(req, res) {
    res.end(application.availableGame(req.games));
};

var newGames = function(req, res) {
    res.end(application.newGames(req.games));
};

app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(loadGame);

app.set('view engine', 'ejs');

app.get('^/availableGame$', availableGame);

app.get('^/newGames$', newGames);

app.get('^/waitingPage.html$', isPlayerRegistered);

app.get('^/kavidiKali.html$', isPlayerRegistered, isPlayerCanPlay);

app = staticPageRoutes.serveStaticPage(app);

app.use(express.static('./HTML'));

app.post('^/login$', login);

app.use(isValidPlayer);

app.get(/^\/update/, handleUpdate);

app.get(/^\/enquiry/, handleEnquiry);

app.get(/^\/instruction/, doInstruction);


module.exports = app;
