var returnBadges, badgerService;

function getAll(request, response) {
  returnBadges(badgerService.getAllBadges(), request, response);
}

function getAllByType(request, response) {
  returnBadges(badgerService.getBadges(null, request.params.badge), request, response);
}

module.exports = function (rb, bs) {
  returnBadges = rb;
  badgerService = bs;
  return {
    getAll: getAll,
    getAllByType: getAllByType
  };
};
