var returnBadges, badgerService, transporter;
var path = require('path');
var helpers = require(path.join(process.cwd(), 'src', 'helpers'));
var mongoose = require('mongoose');
var Claim = mongoose.model('Claim');
var shortid = require('shortid');

function getBadges(request, response) {
  if (!request.params.doi1 || !request.params.doi2) {
    response.status(400).end();
    return;
  }

  returnBadges(badgerService.getBadges(null, null, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  }), request, response);
}

function getBadgeCount(request, response) {
  if (!request.params.doi1 || !request.params.doi2) {
    response.status(400).end();
    return;
  }

  var getBadges = badgerService.getBadges(null, null, {
      '_1': request.params.doi1,
      '_2': request.params.doi2
    });

  getBadges(function (error, badges) {
    if (error !== null) {
      console.log('Get error from return Badges ' + error);
      response.send(error);
    } else {
      response.json(badges.length);
    }
  });
}

function getBadgesByType(request, response) {
  if (!request.params.doi1 || !request.params.doi2) {
    response.status(400).end();
    return;
  }

  returnBadges(badgerService.getBadges(null, request.params.badge, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  }), request, response);
}

function getUserBadges(request, response) {
  if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid) {
    response.status(400).end();
    return;
  }

  returnBadges(badgerService.getBadges(request.params.orcid, null, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  }), request, response);
}

function getUserBadgesByType(request, response) {
  if (!request.params.doi1 || !request.params.doi2 || !request.params.orcid || !request.params.badge) {
    response.status(400).end();
    return;
  }

  returnBadges(badgerService.getBadges(request.params.orcid, request.params.badge, {
    '_1': request.params.doi1,
    '_2': request.params.doi2
  }), request, response);
}

function createPaper(request, response) {
  var doiUrl = helpers.urlFromDOI(request.params.doi1, request.params.doi2);
  var emails = request.body.emails;
  var mailFinal = [];
  for (var e in emails) {
    var email = emails[e];

    // Generate a claim code, store in mongo, email each user their unique claim code
    var claim = new Claim({
      slug: shortid.generate(),
      doi: doiUrl,
      status: 'new'
    });
    claim.save();

    // setup e-mail data with unicode symbols
    var mailOptions = {
        to: email, // list of receivers
        subject: 'Claim badges for your scholarly contributions!', // Subject line
        text: 'You recently authored this academic paper: ' + doiUrl + '. Now, you can claim Contributor Badges based on your contributions. Your claim code: ' + claim.slug + '. You can go here to claim your badges: https://badges.mozillascience.org/issue/' + claim.slug, // plaintext body
        html: '<p>You recently authored this academic paper:  <a href="' + doiUrl + '">' + doiUrl + '</a>.</p>'
              + '<p>Now, you can claim <a href="https://badges.mozillascience.org/">Contributor Badges</a> based on your contributions.</p>'
              + '<p>Your claim code: <a href="https://badges.mozillascience.org/issue/' + claim.slug + '">' + claim.slug + '</a></p>'
              + '<p>You can go <a href="https://badges.mozillascience.org/issue/' + claim.slug + '">here</a> to claim your badges: <a href="https://badges.mozillascience.org/issue/' + claim.slug + '"">https://badges.mozillascience.org/issue/' + claim.slug + '</a></p>'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            // return console.log(error);
            response.send(error);
            return console.log(error);
        }
        mailFinal.push(info);
        if (mailFinal.length === emails.length) {
          response.json(mailFinal);
        }
    });
  }

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
  Claim.find({ slug:slug }).remove().exec();

  var badgeFinal = [];
  badges.map(function (badge) {
    var getBadges = badgerService.createBadge(request.params.orcid, badge, {
      '_1': request.params.doi1,
      '_2': request.params.doi2
    });
    getBadges(function (error, badge) {
      if (error !== null) {
        console.log('Get error from return Badges ' + error);
        response.send(error);
      } else {
        badgeFinal.push(badge);
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
    getBadgesByType: getBadgesByType,
    getUserBadges: getUserBadges,
    getUserBadgesByType: getUserBadgesByType,
    getBadgeCount: getBadgeCount,

    // POST
    createPaper: createPaper,
    createBadges: createBadges
  };
};
