var React = require('react');


var BadgeInstance = React.createClass({

  // The following two functions also exist in helpers.js in the node codebase.
  badgeClassFromURL: function(url) {
    var badgeClass = url.split('/');
    return badgeClass[badgeClass.length - 1];
  },

  ORCIDFromEmail: function(email) {
    var orcidRe = /(\d{4}-\d{4}-\d{4}-\d{3}[\dX])@orcid\.org/;
    var m = orcidRe.exec(email);
    if (m !== null) {
      return m[1];
    }
  },

  render: function() {
    var badgeInstance = this.props.badge,
        doiRe = /(10\.\d{3}\d+)\/(.*)\b/,
        m = doiRe.exec(badgeInstance.json.evidence),
        paperUrl = '/v/#/papers/' + m[1] + '/' + encodeURIComponent(m[2]) + '/badges';

    return (
      <div className="badge pure-u-1-4">
          <div className="pure-u-1-2">
            <img src={ badgeInstance.json.image }/>
          </div>
          <h4><a href={ '/v/#/badges/' + this.badgeClassFromURL(badgeInstance.badge_class) }>{ this.badgeClassFromURL(badgeInstance.badge_class) }</a></h4>
          <a href={ '/v/#/users/' + this.ORCIDFromEmail(badgeInstance.recipient_identifier) + '/badges'}>
            { this.ORCIDFromEmail(badgeInstance.recipient_identifier) } </a><br />
          <a href={ paperUrl } > { badgeInstance.json.evidence } </a>
      </div>
    );
  }
});

module.exports = BadgeInstance;
