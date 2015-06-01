module.exports = function (config) {
  var express = require('express'),
    app = express(),
    path = require('path'),
    system = config.BADGES_SYSTEM,
    orcidRe = /(\d{4}-\d{4}-\d{4}-\d{4})@orcid\.org/,
    Url = require('url'),
    Client = require('badgekit-api-client');

  app.use(express.static(path.join(__dirname, '..', '/public')));

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
    return 'http://dx.doi.org/' + decodeURI(doi);
  }

  function DOIFromURL(url) {
    // pathname should be '/10.1371/journal.pbio.1002126' from 'http://dx.doi.org/10.1371/journal.pbio.1002126'
    return encodeURI(Url.parse(url).pathname);
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
  app.get('/papers/:doi/badges', function (request, response) {
    if (!request.params.doi) {
      response.status(400).end();
      return;
    }
    var evidenceUrl = urlFromDOI(request.params.doi),
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
  app.get('/papers/:doi/badges/:badge', function (request, response) {
    if (!request.params.doi) {
      response.status(400).end();
      return;
    }
    var evidenceUrl = urlFromDOI(request.params.doi),
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
  app.get('/papers/:doi/badges/:orcid/badges', function (request, response) {
    if (!request.params.doi || !request.params.orcid) {
      response.status(400).end();
      return;
    }
    var orcid = request.params.orcid,
      evidenceUrl = urlFromDOI(request.params.doi),
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
  app.get('/papers/:doi/badges/:orcid/badges/:badge', function (request, response) {
    if (!request.params.doi || !request.params.orcid) {
      response.status(400).end();
      return;
    }
    var orcid = request.params.orcid,
      evidenceUrl = urlFromDOI(request.params.doi),
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
  app.post('/papers/:doi/badges/:orcid/badges/:badge', function (request, response) {
    // Create a badge.
    var orcid = request.params.orcid,
      badge = request.params.badge,
      evidence = DOIFromURL(request.params.doi) || request.params.doi,
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
