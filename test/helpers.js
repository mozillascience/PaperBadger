var helpers = require('../src/helpers.js');
var assert = require('assert');

describe("helpers", function () {

  it("emailFromORCID creates an email address", function () {
    assert.equal(helpers.emailFromORCID('test'), 'test@orcid.org');
  });

  it("ORCIDFromEmail strips email leaving username", function () {
    assert.equal(helpers.ORCIDFromEmail('test@orcid.org', 'test'));
  });

  it("modEntry removes email and adds ORCID ID", function () {
    entry = {
      email: "test@orcid.org"
    };
    helpers.modEntry(entry, 'test');
    assert.deepEqual(entry, {
      orcid: 'test'
    });
  });

  it("modEntry deletes only email from entry", function () {
    entry = {
      email: "test@orcid.org",
      science: "lab"
    };
    helpers.modEntry(entry, 'test');
    assert.deepEqual(entry, {
      orcid: 'test',
      science: "lab"
    });
  });

  it("modEntry returns true", function () {
    entry = {
      email: "test@orcid.org"
    };
    assert.equal(helpers.modEntry(entry, 'test'), true);
  });

  it("urlFromDOI returns a doi.org URI given a DOI", function () {
    assert.equal(helpers.urlFromDOI("science"), "http://dx.doi.org/science");
  });

  it("DOIFromURL returns a DOI given a URI", function () {
    assert.equal(helpers.DOIFromURL("http://dx.doi.org/science"), "/science");
    assert.equal(helpers.DOIFromURL("http://dx.doi.org/science/"), "/science/");
    assert.equal(helpers.DOIFromURL("https://dx.doi.org/science"), "/science");
  });

});
