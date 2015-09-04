var mongoose = require('mongoose');
var Claim = mongoose.model('Claim');

module.exports = {
  getClaim: function getClaim(request, response) {
    if (!request.params.slug) {
      response.status(400).end();
      return;
    }
    var query  = Claim.where({ slug: request.params.slug });
    query.findOne(function(err, claim) {
      response.json(claim);
    });
  }
};
