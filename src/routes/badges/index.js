'use strict';

var returnBadges, badgerService;

function getAll(request, response) {
  returnBadges(badgerService.getAllBadges(), request, response);
}

function getAllCount(request, response) {
  badgerService.getAllBadges()(function (error, badges) {
    if (error !== null || !badges) {
      response.json(0);
    } else {
      response.json(badges.length);
    }
  });
}

function getAllByType(request, response) {
  returnBadges(badgerService.getBadges(null, request.params.badge), request, response);
}

function getAllByTypeCount(request, response) {
  if (!request.params.badge) {
    response.status(400).end();
    return;
  }

  badgerService.getBadges(null, request.params.badge)(function (error, badges) {
    if (error !== null || !badges) {
      response.json(0);
    } else {
      response.json(badges.length);
    }
  });
}

module.exports = function (rb, bs) {
  returnBadges = rb;
  badgerService = bs;
  return {
    getAll: getAll,
    getAllCount: getAllCount,
    getAllByType: getAllByType,
    getAllByTypeCount: getAllByTypeCount
  };
};
