var path = require('path');
var helpers = require(path.join(process.cwd(), 'src', 'helpers'));

// We really want a singleton here
var instance, client, system;

function BadgeService() {}

BadgeService.prototype.createBadge = function (orcid, badge, dois, name) {
  return function (callback) {
    var evidence = helpers.urlFromDOI(dois._1, dois._2);
    var context = {
      system: system,
      badge: badge,
      instance: {
        email: helpers.emailFromORCID(orcid),
        evidenceUrl: evidence,
        authorName: name
      }
    };

    client.createBadgeInstance(context, function (err, badgeResult) {
      if (err) {
        console.error(err);
        return callback(err);
      }
      badgeResult = helpers.modEntry(badgeResult);
      callback(null, badgeResult);
    });
  };
};

BadgeService.prototype.getBadges = function (orcid, badge, dois) {
  return function (callback) {
    var evidenceUrl = dois ? helpers.urlFromDOI(dois._1, dois._2) : null;

    var clientCallback = function (err, badges) {
      if (err) {
        console.error(err);
        return callback(err);
      }

      // filter for the badge
      if (badges) {
        filtered = badges.filter(function (entry) {
          var goodBadge = (!badge || entry.badge.slug === badge);
          var goodDoi = (!dois || entry.evidenceUrl === evidenceUrl);
          return goodBadge && goodDoi;
        });

        filtered = filtered.map(helpers.modEntry);
      }

      if (filtered && filtered.length === 0) {
        callback('client return empty result');
      } else {
        callback(null, filtered);
      }
    };

    var filtered;
    var context = {
      system: system
    };
    var options = {};
    if (orcid) {
      options.email = helpers.emailFromORCID(orcid);
    } else {
      context.badge = badge || '*';
    }
    if (evidenceUrl) {
      options.paginate = {
        evidenceUrl: evidenceUrl
      };
    }
    client.getBadgeInstances(context, options, clientCallback);
  };
};

BadgeService.prototype.getAllBadges = function () {
  return function (callback) {
    client.getAllBadges({
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
};

module.exports = {
  init: function (apiClient, config) {
    client = apiClient;
    system = config.get('BADGES_SYSTEM');
  },

  getInstance: function () {
    if (!instance) {
      instance = new BadgeService();
    }
    return instance;
  }
};
