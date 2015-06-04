module.exports = function (config) {
  var express = require('express'),
    app = express(),
    path = require('path'),
    system = config.BADGES_SYSTEM,
    orcidRe = /(\d{4}-\d{4}-\d{4}-\d{4})@orcid\.org/,
    Url = require('url'),
    Client = require('badgekit-api-client');

  app.use(express.static(path.join(__dirname, '..', '/public')));
  
  // Set the client credentials and the OAuth2 server
  var credentials = {
    clientID: config.ORCID_AUTH_CLIENT_ID,
    clientSecret: config.ORCID_AUTH_CLIENT_SECRET,
    site: config.ORCID_AUTH_SITE,
    tokenPath: config.ORCID_AUTH_SITE
  };
  
  // Initialize the OAuth2 Library for ORCID
  var oauth2 = require('simple-oauth2')(credentials);

  // TODO: review proper session use
  var session = require('express-session');
  app.use(session({ secret: config.SESSION_SECRET, cookie: { maxAge: 60000 } }));

  // Build ORCID authorization oauth2 URI
  var authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: 'http://localhost:5000/orcid_auth_callback',
    scope: '/authenticate',
    state: 'none'
  });

  // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
  app.get('/request-orcid-user-auth', function(req, res) {
    // Prepare the context
    res.redirect(authorization_uri);
  });

  // Get the ORCID access token object (the authorization code is given from the previous step).
  app.get('/orcid_auth_callback', function(req, res) {
    var token;
    var code = req.query.code;
    oauth2.authCode.getToken({
      code: code,
      redirect_uri: 'http://localhost:8000/orcid_auth_callback'
    }, function(error, result){
      if (error) {
        // check for access_denied param
        if (req.query.error == 'access_denied')
          // User denied access
          res.redirect('/denied_access');      
        else
          // Token Page
          req.session.orcid_token_error = oauth2.accessToken.create(result);
          res.redirect('/orcid_token_error');
      } else {
        // Token Page
        req.session.orcid_token = oauth2.accessToken.create(result);
        res.redirect('/issue');
      }
    });
  });

  var auth = {
    key: config.BADGES_KEY,
    secret: config.BADGES_SECRET
  };

  var client = new Client(config.BADGES_ENDPOINT, auth);

  function emailFromORCID(orcid) {
    return orcid + '@orcid.org';
  }

  function ORCIDFromEmail(email) {
    var m = orcidRe.exec(email);
    if (m !== null) {
      return m[1];
    }
  }

  function modEntry(entry, orcid) {
    entry.orcid = orcid;
    delete entry.email;
    return true;
  }

  function urlFromDOI(doi) {
    return 'http://dx.doi.org/' + doi;
  }

  function DOIFromURL(url) {
    // pathname should be '/10.1371/journal.pbio.1002126' from 'http://dx.doi.org/10.1371/journal.pbio.1002126'
    return encodeURI(Url.parse(url).pathname) || url;
  }

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
        var orcid = ORCIDFromEmail(entry.email);
        modEntry(entry, orcid);
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
      email: emailFromORCID(orcid)
    }, function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      badges.forEach(function (entry) {
        modEntry(entry, orcid);
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
    }, emailFromORCID(orcid), function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      // filter for the badge
      if (badges) {
        filtered = badges.filter(function (entry) {
          return (entry.badge.slug === request.params.badge) ? modEntry(entry, orcid) : false;
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
    var evidenceUrl = urlFromDOI(request.params.doi1 + '/' + request.params.doi2),
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
          return (entry.evidenceUrl === evidenceUrl) ? modEntry(entry, orcid) : false;
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
    var evidenceUrl = urlFromDOI(request.params.doi1 + '/' + request.params.doi2),
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
          var orcid = ORCIDFromEmail(entry.email);
          return (entry.evidenceUrl === evidenceUrl) ? modEntry(entry, orcid) : false;
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
      evidenceUrl = urlFromDOI(request.params.doi1 + '/' + request.params.doi2),
      filtered;
    // get all badge instances for the user. Is there a more efficient way to do this?
    client.getBadgeInstances({
      system: system
    }, emailFromORCID(orcid), function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      // filter for the badge
      if (badges) {
        filtered = badges.filter(function (entry) {
          return (entry.evidenceUrl === evidenceUrl) ? modEntry(entry, orcid) : false;
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
      evidenceUrl = urlFromDOI(request.params.doi1 + '/' + request.params.doi2),
      filtered;
    // get all badge instances for the user. Is there a more efficient way to do this?
    client.getBadgeInstances({
      system: system
    }, emailFromORCID(orcid), function (err, badges) {
      if (err) {
        console.error(err);
        response.send(err);
        return;
      }
      // filter for the doi & badge
      if (badges) {
        filtered = badges.filter(function (entry) {
          return ((entry.evidenceUrl === evidenceUrl) && (entry.badge.slug === request.params.badge)) ?
            modEntry(entry, orcid) : false;
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
      evidence = DOIFromURL(request.params.doi1 + '/' + request.params.doi2),
      context = {
        system: system,
        badge: badge,
        instance: {
          email: emailFromORCID(orcid),
          evidenceUrl: urlFromDOI(evidence)
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
    response.sendFile(path.join(__dirname, '..', '/public/index.html'));
  });

  return app;
};
