'use strict';

var sqlite3 = require('sqlite3');
var fs = require('fs-extra');

var env = (function () {
  var Habitat = require('habitat');
  Habitat.load('.db.env');
  Habitat.load('default.db.env');
  return new Habitat();
})();

// Make a Sync copy of the DB with badges to get started with
fs.copySync('badges_only.local.sqlite3', 'local.sqlite3');

// Destination DB for badge instances
var badgesDB = new sqlite3.Database('local.sqlite3', function(err){
  if (err) {
    throw err;
  }
});

// Source DB for badge instances; exported from badgekit-server
var bkDB = new sqlite3.Database('badgekit.db', function(err){
  if (err) {
    throw err;
  }
});

function lookUpBadgeData(badgesList, dataItem) {
  var badgeData = {};
  badgesList.forEach(function(item){
    if (item.slug === dataItem.slug) {
      badgeData = {'image': item.image, 'id': item.id};
    }
  });

  return badgeData;
}

function insertToInstance(badgesIdSlug, data) {
  var badgeData = lookUpBadgeData(badgesIdSlug, data);

  var serverUrl = env.get('BADGR_ENDPOINT') + 'public/';
  // using data.newSlug instead of generating a new UID (it is a UID in the original DB).
  var jsonAssertion = {
    'issuedOn': data.issuedOn,
    'uid': data.newSlug,
    'verify': {
      'url': serverUrl + 'assertions/' + data.newSlug,
      'type': 'hosted'
    },
    'image': serverUrl + 'assertions/' + data.newSlug + '/image',
    'recipient': { // Not real credentials
      'type': 'email',
      'salt': '4a5b2567-83e7-43b4-bf42-c2530377c953',
      'hashed': true,
      'identity': 'sha256$98b1d080e491f9df4504ff5fc11b16e73de75043b4eada358e22f58206fd10a9'
    },
    'evidence': data.evidenceUrl,
    'type': 'Assertion',
    '@context': 'https://w3id.org/openbadges/v1',
    'badge': serverUrl + 'badges/' + data.slug,
    'id': serverUrl + 'assertions/' + data.newSlug
  };

  var recipient = {
    'id': data.id,
    'created_at': data.issuedOn,
    'json': jsonAssertion,
    'slug': data.newSlug,
    'image': badgeData.image,
    'revoked': false,
    'revocation_reason': '',
    'created_by_id': 1, // Hardcoded from b@d.gr user
    'issuer_id': 2, // Hardcoded from b@d.gr user's first issuer
    'identifier': 'get_full_url',
    'recipient_identifier': data.email,
    'badgeclass_id': badgeData.id
  };

  badgesDB.run('INSERT INTO issuer_badgeinstance VALUES(:id, :created_at, :json, :slug, :image,' +
    ':revoked, :revocation_reason, :created_by_id, :issuer_id, :identifier, :recipient_identifier,' +
    ':badgeclass_id)', {
      ':id': recipient.id,
      ':created_at': new Date(recipient.created_at),
      ':json': JSON.stringify(recipient.json),
      ':slug': recipient.slug,
      ':image': recipient.image,
      ':revoked': recipient.revoked,
      ':revocation_reason': recipient.revocation_reason,
      ':created_by_id': recipient.created_by_id,
      ':issuer_id': recipient.issuer_id,
      ':identifier': recipient.identifier,
      ':recipient_identifier': recipient.recipient_identifier,
      ':badgeclass_id': recipient.badgeclass_id
    }, function(e){
      if (e) {
        console.log(e);
        console.log('Failed id: ' , recipient.id); // Let other queries run anyway
      }
    });

}

badgesDB.serialize(function(){
  badgesDB.all('SELECT slug, id, image FROM issuer_badgeclass', function(err, badgesIdSlug) {

    bkDB.serialize(function(){
      bkDB.all('select a.id, b.slug, a.slug as newSlug, a.email, a.issuedOn, a.evidenceUrl from badgeinstances a, ' +
        'badges b where a.badgeId=b.id', function(er, data){

        if (er) {
          throw er;
        }

        data.forEach(function(dataItem){
          insertToInstance(badgesIdSlug, dataItem);
        });

        // Close both DBs
        badgesDB.close();
        bkDB.close();
      });
    });

  });
});
