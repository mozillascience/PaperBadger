var returnBadges, badgerService;
var mongoose = require('mongoose');
var User = mongoose.model('User');

function getBadges(request, response) {
  var orcid = request.params.orcid;
  if (!orcid) {
    response.status(400).end();
    return;
  }
  returnBadges(badgerService.getBadges(orcid), request, response);
}

function getBadgeCount(request, response) {
  var orcid = request.params.orcid;
  if (!orcid) {
    response.status(400).end();
    return;
  }

  var getBadges = badgerService.getBadges(orcid);
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
  // get all badge instances for the user. Is there a more efficient way to do this?
  var orcid = request.params.orcid;
  if (!orcid) {
    response.status(400).end();
    return;
  }
  returnBadges(badgerService.getBadges(orcid, request.params.badge), request, response);
}

function getUser(request, response) {
  var orcid;
  response.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  if (request.session.orcid_token && request.session.orcid_token.token) {
    orcid = request.session.orcid_token.token.orcid;
  }

  var query  = User.where({ orcid:orcid });
  query.findOne(function(err, user) {
    if (user) {
      response.json(user);
    } else {
      response.json( orcid ? {
        name: request.session.orcid_token.name,
        orcid: orcid } : null );
    }
  });
}

module.exports = function (rb, bs) {
  returnBadges = rb;
  badgerService = bs;
  return {
    getBadges: getBadges,
    getBadgesByType: getBadgesByType,
    getBadgeCount: getBadgeCount,
    getUser: getUser
  };
};
