var React = require('react'),
    BadgeInstanceList = require('../components/badgeInstanceList.jsx'),
    Page = require('../components/page.jsx');

var viewBadges = React.createClass({
  componentDidMount: function() {
    document.title = "Contributorship Badges";
  },
  render: function() {
    var url = window.location.hash.replace('#/', '');
    console.log(url);
    return (
      <Page>
        <BadgeInstanceList url={ url }>
        </BadgeInstanceList>
      </Page>
    );
  }
});

module.exports = viewBadges;
