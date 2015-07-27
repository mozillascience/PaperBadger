var React = require('react'),
    BadgeInstanceList = require('../components/badgeInstanceList.jsx'),
    Page = require('../components/page.jsx');

var viewBadges = React.createClass({
  componentDidMount: function() {
    document.title = "Contributorship Badges";
    window.onhashchange = this.updateUrl;
  },
  updateUrl: function(){
    this.setState({ url: (window.location.href.split('#')[1] || '' )});
  },
  getInitialState: function() {
    return { url: (window.location.href.split('#')[1] || this.props.url) };
  },
  render: function() {
    return (
      <Page>
        <p>View JSON: <a href={ this.state.url + '?pretty=true' }>{this.state.url}</a></p>
        <BadgeInstanceList url={ this.state.url }>
        </BadgeInstanceList>
      </Page>
    );
  }
});

module.exports = viewBadges;
