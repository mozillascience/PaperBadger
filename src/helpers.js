// should this be configuration?
var orcidRe = /(\d{4}-\d{4}-\d{4}-\d{3}[\dX])@orcid\.org/;
var Url = require('url');

module.exports = {

  emailFromORCID: function (orcid) {
    return orcid + '@orcid.org';
  },

  ORCIDFromEmail: function (email) {
    var m = orcidRe.exec(email);
    if (m !== null) {
      return m[1];
    }
  },

  modEntry: function (entry, orcid) {
    entry.orcid = orcid;
    entry.email = undefined; // set undefined to remove value from badgekit
    delete entry.email;
    return true;
  },

  urlFromDOI: function (doi1, doi2) {
    return 'http://dx.doi.org/' + doi1 + '/' + decodeURIComponent(doi2);
  },

  DOIFromURL: function (url) {
    // pathname should be '10.1371/journal.pbio.1002126' from 'http://dx.doi.org/10.1371/journal.pbio.1002126'
    var doiRe = /(10\.\d{3}\d+\/.*)\b/;
    var m = doiRe.exec(url);
    return m[1];
  }

};
