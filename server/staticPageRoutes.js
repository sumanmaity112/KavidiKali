const config = require('../config');
const lodash = require('lodash');

var serveStaticPage = function(app) {
    var pages = config.staticPageConstants;
    Object.keys(pages).forEach(function(page) {
        if (pages[page].url) {
            app.get(pages[page].url, function(req, res) {
                res.render(pages[page].template, config);
            });
        }
    });
    return app;
};

module.exports = {
    serveStaticPage,
    serverErrorPage: function(res, additionalVars) {
        res.render(config.staticPageConstants.ERROR_PAGE.template, lodash.merge(config, additionalVars))
    }
}
