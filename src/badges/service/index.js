/* eslint camelcase: ["error", {properties: "never"}]*/
'use strict';

var path = require('path');
var helpers = require(path.join(process.cwd(), 'src', 'helpers'));

// We really want a singleton here
var instance, client;

function BadgeService() {}

BadgeService.prototype.createBadge = function (orcid, badge, dois) {
  return function (callback) {

    var options = {
      issuerSlug: 'mozilla-science' // TODO Can we move this value to the library?
    };
    options.badgeSlug = badge;
    options.recipient_identifier = helpers.emailFromORCID(orcid);
    options.evidence = helpers.urlFromDOI(dois._1, dois._2);
    options.create_notification = false;

    client.createBadgeInstance(options, function (err, badgeResult) {
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

    var options = {
      issuerSlug: 'mozilla-science' // TODO Can we move this value to the library?
    };

    // The client takes care of all the filtering, depending on the flags sent (evidence, badge, and recipient)
    var evidenceUrl = dois ? helpers.urlFromDOI(dois._1, dois._2) : null;
    if (evidenceUrl) {
      options.evidence = evidenceUrl;
    }

    if (orcid) {
      options.recipient = helpers.emailFromORCID(orcid);
    }

    if(badge) {
      options.badgeSlug = badge;
    }

    var clientCallback = function (err, badges) {
      if (err) {
        console.error(err);
        return callback(err);
      }

      if (badges && badges.length === 0) {
        callback('client return empty result');
      } else {
        callback(null, badges);
      }
    };

    client.getBadgeInstances(options, clientCallback);
  };
};

BadgeService.prototype.getAllBadges = function () {
  return function (callback) {
    client.getAllBadges(function (err, badges) {
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
  init: function (apiClient) {
    client = apiClient;
  },

  getInstance: function () {
    if (!instance) {
      instance = new BadgeService();
    }
    return instance;
  }
};
