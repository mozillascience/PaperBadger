var React = require('react');


class BadgeInstance extends React.Component {
  render() {
    var badgeInstance = this.props.badge,
        doiRe = /(10\.\d{3}\d+)\/(.*)\b/,
        m = doiRe.exec(badgeInstance.evidenceUrl),
        paperUrl = '/v/#/papers/' + m[1] + '/' + encodeURIComponent(m[2]) + '/badges';

    return (
      <div className="badge pure-u-1-4">
          <div className="pure-u-1-2">
            <img src={ badgeInstance.badge.imageUrl }/>
          </div>
          <h4><a href={ '/v/#/badges/' + badgeInstance.badge.slug }>{ badgeInstance.badge.name }</a></h4>
          <a href={ '/v/#/users/' + badgeInstance.orcid + '/badges'}> { badgeInstance.orcid } </a><br />
          <a href={ paperUrl } > { badgeInstance.evidenceUrl } </a>
      </div>
    );
  }
}

module.exports = BadgeInstance;