var returnBadges, badgerService;
module.exports = function (rb, bs) {
  returnBadges = rb;
  badgerService = bs;
  return {
    // GET
    getBadges: getBadges,
    getBadgesByType: getBadgesByType,
    getUserBadges: getUserBadges,
    getUserBadgesByType: getUserBadgesByType,

    // POST
    create: create,
    createBadges: createBadges
  };
};

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
  // TODO: write this. https://github.com/mozillascience/PaperBadger/issues/23
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
