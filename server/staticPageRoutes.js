module.exports = function(app) {
    app.get('^/waitingPage.html$', function(req, res) {
        res.render('pages/waitingPage');
    });

    app.get('^/kavidiKali.html$', function(req, res) {
        res.render('pages/kavidikali')
    });

    app.get('/index.html', function(req, res) {
        res.render('pages/index')
    });

    app.get('/', function(req, res) {
        res.render('pages/index')
    });

    app.get(/^\/joingame.html/, function(req, res) {
        res.render('pages/joinGame')
    });

    app.get('/contact.html', function(req, res) {
        res.render('pages/contacts')
    });

    app.get('/about.html', function(req, res) {
        res.render('pages/about')
    });

    app.get('/manual.html', function(req, res) {
        res.render('pages/manual')
    });

    app.get('/chooseNoOfPlayer.html', function(req, res) {
        res.render('pages/chooseNoOfPlayer')
    });

    return app;
};
