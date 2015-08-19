// should this be configuration?
var orcidRe = /(\d{4}-\d{4}-\d{4}-\d{3}[\dX])@orcid\.org/;
var path = require('path');

function emailFromORCID(orcid) {
  return orcid + '@orcid.org';
}

function ORCIDFromEmail(email) {
  var m = orcidRe.exec(email);
  if (m !== null) {
    return m[1];
  }
}

function modEntry(entry, orcid) {
  var clone = {};
  Object.keys(entry).forEach(function (key) {
    if (key === 'email') {
      clone.orcid = ORCIDFromEmail(entry.email);
    } else {
      clone[key] = entry[key];
    }
  });
  return clone;
}

function urlFromDOI(doi1, doi2) {
  return 'http://dx.doi.org/' + path.join(doi1, decodeURIComponent(doi2));
}

function DOIFromURL(url) {
  // pathname should be '10.1371/journal.pbio.1002126' from 'http://dx.doi.org/10.1371/journal.pbio.1002126'
  var doiRe = /(10\.\d{3}\d+\/.*)\b/;
  var m = doiRe.exec(url);
  return m[1];
}

module.exports = {
  emailFromORCID: emailFromORCID,
  ORCIDFromEmail: ORCIDFromEmail,
  modEntry: modEntry,
  urlFromDOI: urlFromDOI,
  DOIFromURL: DOIFromURL
};
