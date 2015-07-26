var React = require('react'),
    BadgeInstance = require('./badgeInstance.jsx'),
    fetch = require('isomorphic-fetch');

var BadgeInstanceList = React.createClass({
  loadBadgesFromServer: function() {
    fetch('/' + this.props.url)
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then((badges) => {
        this.setState({data: badges});
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadBadgesFromServer();
  },
  render: function() {
    var badgeNodes = this.state.data.map(function(badge, index) {
      return (
        <BadgeInstance badge={badge} key={badge.slug}>
        </BadgeInstance>
      );
    });
    return (
      <div>
        {badgeNodes}
      </div>
    );
  }
})

module.exports = BadgeInstanceList;