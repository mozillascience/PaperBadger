'use strict';

var helpers = require('../../src/helpers.js');
var assert = require('assert');

describe('helpers', function () {
  var orcid = '0000-0000-0000-000X';
  var entry;

  beforeEach(function () {
    entry = {
      email: orcid + '@orcid.org'
    };
  });

  it('emailFromORCID creates an email address', function () {
    assert.equal(helpers.emailFromORCID('0000-0003-4959-3049'), '0000-0003-4959-3049@orcid.org');
  });

  it('ORCIDFromEmail strips email leaving ORCID', function () {
    assert.equal(helpers.ORCIDFromEmail('0000-0003-4959-3049@orcid.org'), '0000-0003-4959-3049');
  });

  it('ORCIDFromEmail strips email leaving ORCID when ORCID ends in X', function () {
    assert.equal(helpers.ORCIDFromEmail('0000-0002-3881-294X@orcid.org'), '0000-0002-3881-294X');
  });

  it('modEntry removes email and adds ORCID ID', function () {
    assert.deepEqual(helpers.modEntry(entry), {
      orcid: orcid
    });
  });

  it('modEntry deletes only email from entry', function () {
    entry.science = 'lab';
    assert.deepEqual(helpers.modEntry(entry), {
      orcid: orcid,
      science: 'lab'
    });
  });

  it('urlFromDOI returns a doi.org URI given a DOI', function () {
    assert.equal(helpers.urlFromDOI('10.1186', '2047-217X-2-10'), 'http://dx.doi.org/10.1186/2047-217X-2-10');
  });

  it('DOIFromURL returns a DOI given a URI', function () {
    assert.equal(helpers.DOIFromURL('http://dx.doi.org/10.1186/2047-217X-2-10'), '10.1186/2047-217X-2-10');
    assert.equal(helpers.DOIFromURL('http://dx.doi.org/10.1186/2047-217X-2-10/'), '10.1186/2047-217X-2-10');
    assert.equal(helpers.DOIFromURL('https://dx.doi.org/10.1186/2047-217X-2-10'), '10.1186/2047-217X-2-10');
  });
});
