module.exports = function (badgerService) {
  var env = require('./environments');
  var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path');

  app.set('view engine', 'jade');
  app.use(express.static(path.join(__dirname, '..', '/public')));
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
  }));

  function returnBadges(getBadges, request, response) {
    getBadges(function (error, badges) {
      if (error !== null) {
        console.log('Get error from return Badges ' + error);
        response.send(error);
      } else {
        if (request.query.pretty) {
          response.render(path.join(__dirname, '..', '/public/code.jade'), {
            data: JSON.stringify(badges, null, 2)
          });
        } else {
          response.json(badges);
        }
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
  app.use(session({
    secret: env.get('SESSION_SECRET'),
    cookie: {}
  }));

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
          response.redirect('/orcid_token_error');
        }
      } else {
        // Token Page
        request.session.orcid_token = oauth2.accessToken.create(result);
        response.redirect('/issue');
      }
    });
  });

  /* Get all badges from system */

  app.get('/badges', function (request, response) {
    returnBadges(badgerService.getAllBadges(), request, response);
  });

  app.get('/badges/:badge', function (request, response) {
    returnBadges(badgerService.getBadges(null, request.params.badge), request, response);
  });

  /* Get badges for a user */

  // Get all badge instances earned by a user
  app.get('/users/:orcid/badges', function (request, response) {
    var orcid = request.params.orcid;
    if (!orcid) {
      response.status(400).end();
      return;
    }
    returnBadges(badgerService.getBadges(orcid), request, response);
  });

  // Get all badge instances of a certain badge earned by a user
  app.get('/users/:orcid/badges/:badge', function (request, response) {
    // get all badge instances for the user. Is there a more efficient way to do this?
    var orcid = request.params.orcid;
    if (!orcid) {
      response.status(400).end();
      return;
    }
    returnBadges(badgerService.getBadges(orcid, request.params.badge), request, response);
  });

  /* Get badges for a paper */

  // THIS DOES NOT WORK!!
  // Get all badge instances for a paper.
  app.get('/papers/:doi1/:doi2/badges', function (request, response) {
    if (!request.params.doi1 || !request.params.doi2) {
      response.status(400).end();
      return;
    }
    returnBadges(badgerService.getBadges(null, null, {
      '_1': request.params.doi1,
      '_2': request.params.doi2
    }), request, response);
  });

  // Get all badge instances of a certain badge for a paper. NOTE: inefficiently filters for doi afterwards
  app.get('/papers/:doi1/:doi2/badges/:badge', function (request, response) {
    if (!request.params.doi1 || !request.params.doi2) {
      response.status(400).end();
      return;
    }
    returnBadges(badgerService.getBadges(null, request.params.badge, {
      '_1': request.params.doi1,
      '_2': request.params.doi2
    }), request, response);
  });

  // Get all badge instances earned by a user for a paper.
  app.get('/papers/:doi1/:doi2/users/:orcid/badges', function (request, response) {
    if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid) {
      response.status(400).end();
      return;
    }
    returnBadges(badgerService.getBadges(request.params.orcid, null, {
      '_1': request.params.doi1,
      '_2': request.params.doi2
    }), request, response);
  });

  // Get all badge instances of a certain badge earned by a user for a paper.
  app.get('/papers/:doi1/:doi2/users/:orcid/badges/:badge', function (request, response) {
    if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid || !request.params.badge) {
      response.status(400).end();
      return;
    }
    returnBadges(badgerService.getBadges(request.params.orcid, request.params.badge, {
      '_1': request.params.doi1,
      '_2': request.params.doi2
    }), request, response);
  });

  // Publisher submits a new paper
  app.post('/papers/:doi1/:doi2', function (request, response) {
    // TODO: write this. https://github.com/mozillascience/PaperBadger/issues/23
    return;
  });

  // Create a badge instance -- allow for bulk loading in post data
  app.post('/papers/:doi1/:doi2/users/:orcid/badges/:badge?', function (request, response) {
    var orcid;
    if (request.session.orcid_token && request.session.orcid_token.token) {
      orcid = request.session.orcid_token.token.orcid;
    }
    if (orcid !== request.params.orcid) {
      response.status(403).end();
      return;
    }
    if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid) {
      response.status(400).end();
      return;
    }

    var badges = request.body.badges || [request.param.badge];
    var badgeFinal = [];
    badges.map(function (badge) {
      var getBadges = badgerService.createBadge(request.params.orcid, badge, {
        '_1': request.params.doi1,
        '_2': request.params.doi2
      });
      getBadges(function (error, badge) {
        if (error !== null) {
          console.log('Get error from return Badges ' + error);
          response.send(error);
        } else {
          badgeFinal.push(badge);
          if (badgeFinal.length === badges.length) {
            response.json(badgeFinal);
          }
        }
      });
    });
  });

  app.get('*', function (request, response) {
    var orcid;
    if (request.session.orcid_token && request.session.orcid_token.token) {
      orcid = request.session.orcid_token.token.orcid;
    }
    response.render(path.join(__dirname, '..', '/public/index.jade'), {
      orcid: orcid
    });
  });

  return app;
};
