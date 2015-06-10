module.exports = function (apiClient, config) {  
  var system = config.BADGES_SYSTEM;
  // orcidRe = /(\d{4}-\d{4}-\d{4}-\d{4})@orcid\.org/;
  // Url = require('url');

  function emailFromORCID(orcid) {
    return orcid + '@orcid.org';
  }

  // function ORCIDFromEmail(email) {
  //   var m = orcidRe.exec(email);
  //   if (m !== null) {
  //     return m[1];
  //   }
  // }

  function modEntry(entry, orcid) {
    entry.orcid = orcid;
    delete entry.email;
    return true;
  }

  // function urlFromDOI(doi) {
  //   return 'http://dx.doi.org/' + doi;
  // }

  // function DOIFromURL(url) {
  //   // pathname should be '/10.1371/journal.pbio.1002126' from 'http://dx.doi.org/10.1371/journal.pbio.1002126'
  //   return encodeURI(Url.parse(url).pathname) || url;
  // }

  function _getBadges(orcid, badge) {
    return function(callback) {
      var filtered;
      apiClient.getBadgeInstances({
        system: system
      }, emailFromORCID(orcid), function (err, badges) {
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
      });
    }        
  }

  function _getAllBadges() {    
    return function(callback) {      
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
