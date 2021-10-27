'use strict';

var returnBadges, badgerService, transporter;
var path = require('path');
var helpers = require(path.join(process.cwd(), 'src', 'helpers'));
var mongoose = require('mongoose');
var Claim = mongoose.model('Claim');
var User = mongoose.model('User');
var shortid = require('shortid');

function getBadgesByDoi(request, response) {
  if (!request.params.doi1 || !request.params.doi2) {
    response.status(400).end();
    return;
  }

  return badgerService.getBadges(null, null, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  });
}

function getBadges(request, response) {
  returnBadges(getBadgesByDoi(request, response), request, response);
}

function getBadgeCount(request, response) {
  getBadgesByDoi(request, response)(function (error, badges) {
    if (error !== null || !badges) {
      response.json(0);
    } else {
      response.json(badges.length);
    }
  });
}


function getBadgesByType(request, response) {
  if (!request.params.doi1 || !request.params.doi2 || !request.params.badge) {
    response.status(400).end();
    return;
  }

  return badgerService.getBadges(null, request.params.badge, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  });
}

function getBadgesByBadge(request, response) {
  returnBadges(getBadgesByType(request, response), request, response);
}

function getBadgesByBadgeCount(request, response) {
  getBadgesByType(request, response)(function (error, badges) {
    if (error !== null || !badges) {
      response.json(0);
    } else {
      response.json(badges.length);
    }
  });
}

function getBadgesByUser(request, response) {
  if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid) {
    response.status(400).end();
    return;
  }

  return badgerService.getBadges(request.params.orcid, null, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  });
}

function getUserBadges(request, response) {
  returnBadges(getBadgesByUser(request, response), request, response);
}

function getUserBadgeCount(request, response) {
  getBadgesByUser(request, response)(function (error, badges) {
    if (error !== null || !badges) {
      response.json(0);
    } else {
      response.json(badges.length);
    }
  });
}

function getUserBadgesByType(request, response) {
  if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid || !request.params.badge) {
    response.status(400).end();
    return;
  }

  return badgerService.getBadges(request.params.orcid, request.params.badge, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  });
}

function getUserBadgesByBadge(request, response) {
  returnBadges(getUserBadgesByType(request, response), request, response);
}

function getUserBadgesByBadgeCount(request, response) {
  getUserBadgesByType(request, response)(function (error, badges) {
    if (error !== null || !badges) {
      response.json(0);
    } else {
      response.json(badges.length);
    }
  });
}

function createPaper(request, response) {
  var orcid;
  if (request.session.orcid_token && request.session.orcid_token.token) {
    orcid = request.session.orcid_token.token.orcid;
  }
  var query = User.where({orcid: orcid});
  query.findOne(function (err, user) {
    if (!user || (user.role !== 'publisher')) {
      response.status(403).end();
      return;
    }
  });

  var doiUrl = helpers.urlFromDOI(request.params.doi1, request.params.doi2);
  var emails = request.body.emails;
  var mailFinal = [];
  emails.map(function (email) {
    // Generate a claim code, store in mongo, email each user their unique claim code
    var claim = new Claim({
      slug: shortid.generate(),
      doi: doiUrl,
      status: 'new'
    });
    claim.save();


    var html = '<p>You recently authored this academic paper:  <a href="' + doiUrl + '">';
    html += doiUrl + '</a>.</p>';
    html += '<p>Now, you can claim <a href="https://badges.mozillascience.org/">';
    html += 'Contributor Badges</a> based on your contributions.</p>';
    html += '<p>Your claim code: <a href="https://badges.mozillascience.org/issue/';
    html += claim.slug + '">' + claim.slug + '</a></p>';
    html += '<p>You can go <a href="https://badges.mozillascience.org/issue/';
    html += claim.slug + '">here</a> to claim your badges: <a href="https://badges.mozillascience.org/issue/';
    html += claim.slug + '"">https://badges.mozillascience.org/issue/';
    html += claim.slug + '</a></p>';

    var text = 'You recently authored this academic paper: ';
    text += doiUrl + '. Now, you can claim Contributor Badges based on your contributions. Your claim code: ';
    text += claim.slug + '. You can go here to claim your badges: https://badges.mozillascience.org/issue/';
    text += claim.slug;

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: 'noreply@mozillascience.org',
      to: email, // list of receivers
      subject: 'Claim badges for your scholarly contributions from Mozilla Science Paper Badger', // Subject line
      text: text, // plaintext body
      html: html
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // return console.log(error);
        response.send(error);
        return console.log(error);
      }
      mailFinal.push(info);
      if (mailFinal.length === emails.length) {
        response.json(mailFinal);
      }
    });
  });
}

function createBadges(request, response) {
  var orcid;
  if (request.session.orcid_token && request.session.orcid_token.token) {
    orcid = request.session.orcid_token.token.orcid;
  }
  if (orcid !== request.params.orcid) {
    response.status(403).end();
    return;
  }
  if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid) {
    response.status(400).end();
    return;
  }
  var badges = request.body.badges || [request.param.badge];

  // Delete the claim code once it's been used
  var slug = request.body.claim;
  Claim.find({slug: slug}).remove().exec();

  var badgeFinal = [];
  badges.map(function (badge) {
    var getTheBadges = badgerService.createBadge(request.params.orcid, badge, {
      '_1': request.params.doi1,
      '_2': request.params.doi2
    });
    getTheBadges(function (error, aBadge) {
      if (error !== null) {
        console.log('Get error from return Badges ' + error);
        response.send(error);
      } else {
        badgeFinal.push(aBadge);
        if (badgeFinal.length === badges.length) {
          response.json(badgeFinal);
        }
      }
    });
  });
}


module.exports = function (rb, bs, tr) {
  returnBadges = rb;
  badgerService = bs;
  transporter = tr;

  return {
    // GET
    getBadges: getBadges,
    getBadgeCount: getBadgeCount,
    getBadgesByBadge: getBadgesByBadge,
    getBadgesByBadgeCount: getBadgesByBadgeCount,
    getUserBadges: getUserBadges,
    getUserBadgeCount: getUserBadgeCount,
    getUserBadgesByBadge: getUserBadgesByBadge,
    getUserBadgesByBadgeCount: getUserBadgesByBadgeCount,

    // POST
    createPaper: createPaper,
    createBadges: createBadges
  };
};
