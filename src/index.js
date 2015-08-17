var app = require('./app');
var env = require('./environments');
var client = require('./badgeClient');
var service = require('./badgeService');

function init() {
    service.init(client, env);
    app.listen(env.get('PORT'), function () {
        console.log('PaperBadger started on port: ', env.get('PORT'));
    });
}

init();
