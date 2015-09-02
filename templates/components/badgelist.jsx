var React = require('react'),
    Badge = require('./badge.jsx');

var BadgeList = React.createClass({
  loadUsersFromServer: function() {
    fetch('/badges')
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
    this.loadUsersFromServer();
  },
  render: function() {
    var badgeNodes = this.state.data.map(function(badge, index) {
      return (
        <Badge badge={badge} key={badge.id}>
        </Badge>
      );
    });
    return (
      <div>
        {badgeNodes}
      </div>
    );
  }
})

module.exports = BadgeList;