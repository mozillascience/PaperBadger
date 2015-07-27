var React = require('react'),
    BadgeInstanceList = require('../components/badgeInstanceList.jsx'),
    Page = require('../components/page.jsx'),
    orcidRe = /\/users\/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])/,
    doiRe = /\/papers\/(10\.\d{3}\d+)\/([^\/]*)\//,
    badgeRe = /\/badges\/([a-z_]*)\b/;

var viewBadges = React.createClass({
  componentDidMount: function() {
    document.title = "Contributorship Badges";
    window.onhashchange = this.updateUrl;
    this.updateUrl();
  },
  updateUrl: function(){
    var url =  (window.location.href.split('#')[1] || ''),
        orcid = orcidRe.exec(url),
        doi = doiRe.exec(url),
        badge = badgeRe.exec(url);

    orcid = orcid && orcid[1];
    doi = doi && [doi[1], decodeURIComponent(doi[2])];
    badge = badge && badge[1];

    this.setState({ url: url,
                    orcid: orcid,
                    doi: doi,
                    badge: badge });
  },
  getInitialState: function() {
    return { };
  },
  render: function() {
    var orcid, badge, doi;
    if(this.state.orcid) {
      orcid = (<p>Badges for user <a href={ 'http://orcid.org/' + this.state.orcid}>{this.state.orcid}</a></p>);
    }
    if(this.state.doi){
      doi = (<p>Badges for paper <a href={ 'http://dx.doi.org/' + this.state.doi.join('/') }>{this.state.doi.join('/') }</a></p>);
    }
    if(this.state.badge){
      badge = (<p>All {this.state.badge} badges </p>);
    }
    return (
      <Page>
        <p>View JSON: <a href={ this.state.url + '?pretty=true' }>{this.state.url}</a></p>
        { orcid }
        { doi }
        { badge }
        <BadgeInstanceList url={ this.state.url }>
        </BadgeInstanceList>
      </Page>
    );
  }
});

module.exports = viewBadges;
