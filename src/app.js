module.exports = function (config) {

  var express = require('express'),
    helpers = require('./helpers'),
    app = express(),
    path = require('path'),
    system = config.BADGES_SYSTEM,
    Url = require('url'),
    Client = require('badgekit-api-client');

  app.use(express.static(path.join(__dirname, '..', '/public')));

  // Set the client credentials and the OAuth2 server
  var credentials = {
    clientID: config.ORCID_AUTH_CLIENT_ID,
    clientSecret: config.ORCID_AUTH_CLIENT_SECRET,
    site: config.ORCID_AUTH_SITE,
    tokenPath: config.ORCID_AUTH_TOKEN_PATH
  };

  // Initialize the OAuth2 Library for ORCID
  var oauth2 = require('simple-oauth2')(credentials);

  // TODO: review proper session use
  var session = require('express-session');
  app.use(session({
    secret: config.SESSION_SECRET,
    cookie: {}
  }));

  // Build ORCID authorization oauth2 URI
  var authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: config.ORCID_REDIRECT_URI,
    scope: '/authenticate',
    state: 'none'
  });

  // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
  app.get('/request-orcid-user-auth', function (request, response) {
    // Prepare the context
    response.redirect(authorization_uri);
  });

  // Get the ORCID access token object (the authorization code from previous step)
  app.get('/orcid_auth_callback', function (request, response) {
    var token;
    var code = request.query.code;
    oauth2.authCode.getToken({
      code: code,
      redirect_uri: config.ORCID_REDIRECT_URI
    }, function (error, result) {
      if (error) {
        // check for access_denied param
        if (request.query.error == 'access_denied') {
          // User denied access
          response.redirect('/denied_access');
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

  var auth = {
    key: config.BADGES_KEY,
    secret: config.BADGES_SECRET
  };

  var client = new Client(config.BADGES_ENDPOINT, auth);

  app.get('/badges', function (request, response) {
    client.getAllBadges({
      system: system
    }, function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      response.send(badges);
    });
  });

  // Get all badge instances of a certain badge
  app.get('/badges/:badge', function (request, response) {
    client.getBadgeInstances({
      system: system,
      badge: request.params.badge
    }, function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      badges.forEach(function (entry) {
        var orcid = helpers.ORCIDFromEmail(entry.email);
        helpers.modEntry(entry, orcid);
      });
      response.send(badges);
    });
  });

  /* Get badges for a user */

  // Get all badge instances earned by a user
  app.get('/users/:orcid/badges', function (request, response) {
    var orcid = request.params.orcid;
    if (!orcid) {
      response.status(400).end();
      return;
    }
    client.getBadgeInstances({
      system: system
    }, {
      email: helpers.emailFromORCID(orcid)
    }, function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      badges.forEach(function (entry) {
        helpers.modEntry(entry, orcid);
      });
      response.send(badges);
    });
  });

  // Get all badge instances of a certain badge earned by a user
  app.get('/users/:orcid/badges/:badge', function (request, response) {
    // get all badge instances for the user. Is there a more efficient way to do this?
    var orcid = request.params.orcid,
      filtered;
    if (!orcid) {
      response.status(400).end();
      return;
    }
    client.getBadgeInstances({
      system: system
    }, helpers.emailFromORCID(orcid), function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      // filter for the badge
      if (badges) {
        filtered = badges.filter(function (entry) {
          return (entry.badge.slug === request.params.badge) ? helpers.modEntry(entry, orcid) : false;
        });
      }
      if (filtered && filtered.length === 0) {
        response.status(404).end();
      } else {
        response.send(filtered);
      }
    });
  });

  /* Get badges for a paper */

  // THIS DOES NOT WORK!!
  // Get all badge instances for a paper.
  app.get('/papers/:doi1/:doi2/badges', function (request, response) {
    if (!request.params.doi1 || !request.params.doi2) {
      response.status(400).end();
      return;
    }
    var evidenceUrl = helpers.urlFromDOI(request.params.doi1 + '/' + request.params.doi2),
      filtered;
    // get all badge instances for the user. Is there a more efficient way to do this?
    client.getBadgeInstances({
      system: system
    }, function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      // filter for the badge
      if (badges) {
        filtered = badges.filter(function (entry) {
          var orcid = ORCIDFromEmail(entry.email);
          return (entry.evidenceUrl === evidenceUrl) ? helpers.modEntry(entry, orcid) : false;
        });
      }
      if (filtered && filtered.length === 0) {
        response.status(404).end();
      } else {
        response.send(filtered);
      }
    });
  });

  // Get all badge instances of a certain badge for a paper. NOTE: inefficiently filters for doi afterwards
  app.get('/papers/:doi1/:doi2/badges/:badge', function (request, response) {
    if (!request.params.doi1 || !request.params.doi2) {
      response.status(400).end();
      return;
    }
    var evidenceUrl = helpers.urlFromDOI(request.params.doi1 + '/' + request.params.doi2),
      filtered;
    // get all badge instances for the user. Is there a more efficient way to do this?
    client.getBadgeInstances({
      system: system,
      badge: request.params.badge
    }, function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      // filter for the badge
      if (badges) {
        filtered = badges.filter(function (entry) {
          var orcid = helpers.ORCIDFromEmail(entry.email);
          return (entry.evidenceUrl === evidenceUrl) ? helpers.modEntry(entry, orcid) : false;
        });
      }
      if (filtered && filtered.length === 0) {
        response.status(404).end();
      } else {
        response.send(filtered);
      }
    });
  });

  // Get all badge instances earned by a user for a paper.
  app.get('/papers/:doi1/:doi2/:badges/:orcid/badges', function (request, response) {
    if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid) {
      response.status(400).end();
      return;
    }
    var orcid = request.params.orcid,
      evidenceUrl = helpers.urlFromDOI(request.params.doi1 + '/' + request.params.doi2),
      filtered;
    // get all badge instances for the user. Is there a more efficient way to do this?
    client.getBadgeInstances({
      system: system
    }, helpers.emailFromORCID(orcid), function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      // filter for the badge
      if (badges) {
        filtered = badges.filter(function (entry) {
          return (entry.evidenceUrl === evidenceUrl) ? helpers.modEntry(entry, orcid) : false;
        });
      }
      if (filtered && filtered.length === 0) {
        response.status(404).end();
      } else {
        response.send(filtered);
      }
    });
  });

  // Get all badge instances of a certain badge earned by a user for a paper.
  app.get('/papers/:doi1/:doi2/users/:orcid/badges/:badge', function (request, response) {
    if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid) {
      response.status(400).end();
      return;
    }
    var orcid = request.params.orcid,
      evidenceUrl = helpers.urlFromDOI(request.params.doi1 + '/' + request.params.doi2),
      filtered;
    // get all badge instances for the user. Is there a more efficient way to do this?
    client.getBadgeInstances({
      system: system
    }, helpers.emailFromORCID(orcid), function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      // filter for the doi & badge
      if (badges) {
        filtered = badges.filter(function (entry) {
          return ((entry.evidenceUrl === evidenceUrl) && (entry.badge.slug === request.params.badge)) ?
            helpers.modEntry(entry, orcid) : false;
        });
      }
      if (filtered && filtered.length === 0) {
        response.status(404).end();
      } else {
        response.send(filtered);
      }
    });
  });

  // Create a badge instance -- need to add auth around this
  app.post('/papers/:doi1/:doi2/users/:orcid/badges/:badge', function (request, response) {
    // Create a badge.
    var orcid = request.params.orcid,
      badge = request.params.badge,
      evidence = helpers.DOIFromURL(request.params.doi1 + '/' + request.params.doi2),
      context = {
        system: system,
        badge: badge,
        instance: {
          email: helpers.emailFromORCID(orcid),
          evidenceUrl: helpers.urlFromDOI(evidence)
        }
      };
    client.createBadgeInstance(context, function (err, badge) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      modEntry(badge, orcid);
      response.send(badge);
    });
  });

  app.get('*', function (request, response) {
    var orcid = request.session.orcid_token && request.session.orcid_token.token && request.session.orcid_token.token.orcid;
    response.render(path.join(__dirname, '..', '/public/index.jade'), {
      orcid: orcid
    });
  });

  return app;
};
