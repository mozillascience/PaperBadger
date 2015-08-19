var returnBadges, badgerService;

function getBadges(request, response) {
  var orcid = request.params.orcid;
  if (!orcid) {
    response.status(400).end();
    return;
  }
  returnBadges(badgerService.getBadges(orcid), request, response);
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

module.exports = function (rb, bs) {
  returnBadges = rb;
  badgerService = bs;
  return {
    getBadges: getBadges,
    getBadgesByType: getBadgesByType
  };
};
