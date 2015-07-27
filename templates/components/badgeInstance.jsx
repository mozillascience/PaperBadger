var React = require('react');


var BadgeInstance = React.createClass({
  render: function() {
    var badge = this.props.badge,
        doiRe = /(10\.\d{3}\d+)\/(.*)\b/,
        m = doiRe.exec(badge.evidenceUrl),
        paperUrl = '/v/#/papers/' + m[1] + '/' + encodeURIComponent(m[2]) + '/badges';

    return (
      <div className="badge pure-u-1-4">
          <div className="pure-u-1-2">
            <img src={ badge.badge.imageUrl }/>
          </div>
          <h4><a href={ '/v/#/badges/' + badge.badge.slug }>{ badge.badge.name }</a></h4>
          <a href={ '/v/#/users/' + badge.orcid + '/badges'}> { badge.orcid } </a><br />
          <a href={ paperUrl } > { badge.evidenceUrl } </a>
      </div>
    );
  }
});

module.exports = BadgeInstance;