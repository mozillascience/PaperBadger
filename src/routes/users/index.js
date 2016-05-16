'use strict';

var returnBadges, badgerService;
var mongoose = require('mongoose');
var User = mongoose.model('User');

function getBadgeByUser(request, response) {
  if (!request.params.orcid) {
    response.status(400).end();
    return;
  }
  return badgerService.getBadges(request.params.orcid);
}

function getBadges(request, response) {
  returnBadges(getBadgeByUser(request, response), request, response);
}

function getBadgeCount(request, response) {
  getBadgeByUser(request, response)(function (error, badges) {
    if (error !== null || !badges) {
      response.json(0);
    } else {
      response.json(badges.length);
    }
  });
}

function getBadgesByType(request, response){
  if (!request.params.orcid || !request.params.badge) {
    response.status(400).end();
    return;
  }
  return badgerService.getBadges(request.params.orcid, request.params.badge);
}

function getBadgesByBadge(request, response) {
  returnBadges(getBadgesByType(request, response), request, response);
}

function getBadgesByBadgeCount(request, response) {
  getBadgesByType(request, response)(function (error, badges) {
    if (error !== null || !badges) {
      response.json(0);
    } else {
      response.json(badges.length);
    }
  });
}

function getUser(request, response) {
  var orcid;
  response.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  if (request.session.orcid_token && request.session.orcid_token.token) {
    orcid = request.session.orcid_token.token.orcid;
  }

  var query = User.where({ orcid:orcid });
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
    getBadgeCount: getBadgeCount,
    getBadgesByBadge: getBadgesByBadge,
    getBadgesByBadgeCount: getBadgesByBadgeCount,
    getUser: getUser
  };
};
