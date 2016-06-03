var React = require('react'),
    Badge = require('./badge.jsx');

class BadgeList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {data: []};
  }

  loadUsersFromServer() {
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
  }

  componentDidMount() {
    this.loadUsersFromServer();
  }

  render() {
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
}

module.exports = BadgeList;