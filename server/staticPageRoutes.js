const config = require('../config');

module.exports = function(app) {
    app.get('^/waitingPage.html$', function(req, res) {
        res.render('pages/waitingPage', config);
    });

    app.get('^/kavidiKali.html$', function(req, res) {
        res.render('pages/kavidikali', config);
    });

    app.get('/index.html', function(req, res) {
        res.render('pages/index', config);
    });

    app.get('/', function(req, res) {
        res.render('pages/index', config);
    });

    app.get(/^\/joingame.html/, function(req, res) {
        res.render('pages/joinGame', config);
    });

    app.get('/contact.html', function(req, res) {
        res.render('pages/contacts', config);
    });

    app.get('/about.html', function(req, res) {
        res.render('pages/about', config);
    });

    app.get('/manual.html', function(req, res) {
        res.render('pages/manual', config);
    });

    app.get('/chooseNoOfPlayer.html', function(req, res) {
        res.render('pages/chooseNoOfPlayer', config);
    });

    return app;
};
