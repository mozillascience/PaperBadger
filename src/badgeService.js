module.exports = function (apiClient, config) {
  var system = config.BADGES_SYSTEM;
  var helpers = require('./helpers');

  function _getBadges(orcid, badge, dois) {
    return function (callback) {      
      // var evidenceUrl = dois ? helpers.urlFromDOI(dois._1 + '/' + dois._2) : null;
      var clientCallback = function (err, badges) {
        if (err) {
          console.error(err);
          return callback(err);
        }

        // filter for the badge
        if (badges) {                              
          filtered = badges.filter(function (entry) {
            var goodBadge = (!badge || entry.badge.slug === badge);            
            // var goodDoi = (dois === null || entry.evidenceUrl === evidenceUrl);
            return goodBadge;
          });

          filtered.forEach(function (entry) {
            var orcid = helpers.ORCIDFromEmail(entry.email);
            helpers.modEntry(entry, orcid);
          });
        }

        if (filtered && filtered.length === 0) {
          callback('client return empty result');
        } else {          
          callback(null, filtered);
        }
      }

      if (orcid) {
        var filtered;
        apiClient.getBadgeInstances({
          system: system
        }, helpers.emailFromORCID(orcid), clientCallback);
      } else {        
        var filtered;
        apiClient.getBadgeInstances({
          system: system,
          badge: badge
        }, clientCallback);
      }

    };
  }

  function _getAllBadges() {
    return function (callback) {
      apiClient.getAllBadges({
        system: system
      }, function (err, badges) {
        if (err) {
          console.error(err);
          callback(err);
        } else {
          callback(null, badges);
        }
      });
    };
  }

  return {
    getBadges: _getBadges,
    getAllBadges: _getAllBadges
  };
};
