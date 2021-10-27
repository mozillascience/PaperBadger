'use strict';

// Custom rule due to the ORCID API using properties not in camelCase
/* eslint camelcase: [2, {properties: "never"}] */

var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');

var env = require('./environments');
var badgerService = require('./badges/service').getInstance();

var mongoose = require('mongoose');
var mongoUri = env.get('MONGOLAB_URI');

var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

// create reusable transporter object using Amazon SES transport
var transporter = nodemailer.createTransport(ses({
  AWSAccessKeyID: env.get('AWS_ACCESS_KEY'),
  AWSSecretKey: env.get('AWS_SECRET_KEY')
}));

// We are simply defining the app in this module.
// Anything below here will configure the app reference.
var app = express();
module.exports = app;
app.enable('trust proxy');

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '..', '/public')));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('connection!');
});

require('./models.js');

function returnBadges(getBadges, request, response) {
  getBadges(function (error, badges) {
    if (error !== null) {
      console.log('Get error from return Badges ' + error);
      return response.send(error);
    }
    if (request.query.pretty) {
      response.render(path.join(__dirname, '..', '/public/code.pug'), {
        data: JSON.stringify(badges, null, 2)
      });
    } else {
      response.json(badges);
    }
  });
}

// Set the client credentials and the OAuth2 server
var credentials = {
  clientID: env.get('ORCID_AUTH_CLIENT_ID'),
  clientSecret: env.get('ORCID_AUTH_CLIENT_SECRET'),
  site: env.get('ORCID_AUTH_SITE'),
  tokenPath: env.get('ORCID_AUTH_TOKEN_PATH')
};

// Initialize the OAuth2 Library for ORCID
var oauth2 = require('simple-oauth2')(credentials);

// TODO: review proper session use
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var sessionConfig = {
  secret: env.get('SESSION_SECRET'),
  store: new RedisStore({
    url: env.get('REDISCLOUD_URL') || 'redis://127.0.0.1:6379/0'
  }),
  name: 'sid', // Generic - don't leak information
  proxy: true, // Trust the reverse proxy for HTTPS/SSL
  cookie: {
    httpOnly: true, // Reduce XSS attack vector
    secure: true // Cookies via SSL
  },
  resave: true,
  saveUninitialized: true
};

if (env.get('APP') !== 'production') {
  // Allow non-SSL cookies when not in production
  sessionConfig.proxy = false;
  sessionConfig.cookie.secure = false;
}

app.use(session(sessionConfig));

// Build ORCID authorization oauth2 URI
var authorizationUri = oauth2.authCode.authorizeURL({
  redirect_uri: env.get('ORCID_REDIRECT_URI'),
  scope: '/authenticate',
  state: 'none'
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
app.get('/request-orcid-user-auth', function (request, response) {
  // Prepare the context
  response.redirect(authorizationUri);
});

// Get the ORCID access token object (the authorization code from previous step)
app.get('/orcid_auth_callback', function (request, response) {
  var code = request.query.code;
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: env.get('ORCID_REDIRECT_URI')
  }, function (error, result) {
    if (error) {
      // check for access_denied param
      if (request.query.error === 'access_denied') {
        // User denied access
        response.redirect('/denied');
      } else {
        // Token Page
        request.session.orcid_token_error = oauth2.accessToken.create(result);
        response.redirect('/denied');
      }
    } else {
      // Token Page
      request.session.orcid_token = oauth2.accessToken.create(result);
      response.redirect('/issue/');
    }
  });
});

// Routes for badges
var badges = require('./routes/badges')(returnBadges, badgerService);
app.get('/badges', badges.getAll);
app.get('/badges/count', badges.getAllCount);
app.get('/badges/:badge', badges.getAllByType);
app.get('/badges/:badge/count', badges.getAllByTypeCount);

// Routes for user
var users = require('./routes/users')(returnBadges, badgerService);
app.get('/users/:orcid/badges', users.getBadges);
app.get('/users/:orcid/badges/count', users.getBadgeCount);
app.get('/users/:orcid/badges/:badge', users.getBadgesByBadge);
app.get('/users/:orcid/badges/:badge/count', users.getBadgesByBadgeCount);
app.get('/user', users.getUser);

// Routes for papers
var papers = require('./routes/papers')(returnBadges, badgerService, transporter);
app.get('/papers/:doi1/:doi2/badges', papers.getBadges);
app.get('/papers/:doi1/:doi2/badges/count', papers.getBadgeCount);
app.get('/papers/:doi1/:doi2/badges/:badge', papers.getBadgesByBadge);
app.get('/papers/:doi1/:doi2/badges/:badge/count', papers.getBadgesByBadgeCount);
app.get('/papers/:doi1/:doi2/users/:orcid/badges', papers.getUserBadges);
app.get('/papers/:doi1/:doi2/users/:orcid/badges/count', papers.getUserBadgeCount);
app.get('/papers/:doi1/:doi2/users/:orcid/badges/:badge', papers.getUserBadgesByBadge);
app.get('/papers/:doi1/:doi2/users/:orcid/badges/:badge/count', papers.getUserBadgesByBadgeCount);
app.post('/papers/:doi1/:doi2', papers.createPaper);
app.post('/papers/:doi1/:doi2/users/:orcid/badges/:badge?', papers.createBadges);

// Routes for issue badge claims
var claims = require('./routes/claims');
app.get('/claims/:slug', claims.getClaim);

app.get('*', function (request, response) {
  request.session.redirect = request.originalUrl;
  var orcid;
  if (request.session.orcid_token && request.session.orcid_token.token) {
    orcid = request.session.orcid_token.token.orcid;
  }
  response.render(path.join(__dirname, '..', '/public/index.pug'), {
    orcid: orcid
  });
});
