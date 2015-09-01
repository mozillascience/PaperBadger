var returnBadges, badgerService;
var path = require('path');
var helpers = require(path.join(process.cwd(), 'src', 'helpers'));
var mongoose = require('mongoose');
var Claim = mongoose.model('Claim');
var shortid = require('shortid');

function getBadges(request, response) {
  if (!request.params.doi1 || !request.params.doi2) {
    response.status(400).end();
    return;
  }

  returnBadges(badgerService.getBadges(null, null, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  }), request, response);
}

function getBadgeCount(request, response) {
  if (!request.params.doi1 || !request.params.doi2) {
    response.status(400).end();
    return;
  }

  var getBadges = badgerService.getBadges(null, null, {
      '_1': request.params.doi1,
      '_2': request.params.doi2
    });

  getBadges(function (error, badges) {
    if (error !== null) {
      console.log('Get error from return Badges ' + error);
      response.send(error);
    } else {
      response.json(badges.length);
    }
  });
}

function getBadgesByType(request, response) {
  if (!request.params.doi1 || !request.params.doi2) {
    response.status(400).end();
    return;
  }

  returnBadges(badgerService.getBadges(null, request.params.badge, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  }), request, response);
}

function getUserBadges(request, response) {
  if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid) {
    response.status(400).end();
    return;
  }

  returnBadges(badgerService.getBadges(request.params.orcid, null, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  }), request, response);
}

function getUserBadgesByType(request, response) {
  if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid || !request.params.badge) {
    response.status(400).end();
    return;
  }

  returnBadges(badgerService.getBadges(request.params.orcid, request.params.badge, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  }), request, response);
}

function create(request, response) {
  var doiUrl = helpers.urlFromDOI(request.params.doi1, request.params.doi2);
  var emails = request.body.emails;

  for (var email of emails) {
    var claim = new Claim({
      slug: shortid.generate(),
      doi: doiUrl,
      status: 'new'
    });
    claim.save();

    // TODO: make this actually send an email. Do not store emails.
    console.log('send an email to ' + email + ' sending them to /issue/' + claim.slug + '. For paper: ' + doiUrl);
  }

  return;
}

function createBadges(request, response) {
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
}


module.exports = function (rb, bs) {
  returnBadges = rb;
  badgerService = bs;
  return {
    // GET
    getBadges: getBadges,
    getBadgesByType: getBadgesByType,
    getUserBadges: getUserBadges,
    getUserBadgesByType: getUserBadgesByType,
    getBadgeCount: getBadgeCount,

    // POST
    create: create,
    createBadges: createBadges
  };
};
