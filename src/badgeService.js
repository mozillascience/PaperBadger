module.exports = function (apiClient, config) {
  var system = config.BADGES_SYSTEM;

  function emailFromORCID(orcid) {
    return orcid + '@orcid.org';
  }

  function modEntry(entry, orcid) {
    entry.orcid = orcid;
    delete entry.email;
    return true;
  }

  function clientCallback(err, badges) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    // filter for the badge
    if (badges) {
      filtered = badges.filter(function (entry) {
        return (entry.badge.slug === badge) ? modEntry(entry, orcid) : false;
      });
    }

    if (filtered && filtered.length === 0) {
      callback('not found');
    } else {
      callback(null, filtered);
    }
  }

  function _getBadges(orcid, badge) {
    return function (callback) {

      var clientCallback = function (err, badges) {
        if (err) {
          console.error(err);
          return callback(err);
        }
        // filter for the badge
        if (badges) {          
          filtered = badges.filter(function (entry) {
            return (entry.badge.slug === badge) ? modEntry(entry, orcid) : false;
          });
        }

        if (filtered && filtered.length === 0) {
          callback('not found');
        } else {          
          callback(null, filtered);
        }
      }

      if (orcid) {
        var filtered;
        apiClient.getBadgeInstances({
          system: system
        }, emailFromORCID(orcid), clientCallback);
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
