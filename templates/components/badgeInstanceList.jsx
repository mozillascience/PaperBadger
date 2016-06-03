var React = require('react'),
    BadgeInstance = require('./badgeInstance.jsx');

class BadgeInstanceList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.loadBadgesFromServer = this.loadBadgesFromServer.bind(this);
    this.state = {data: [], url:props.url};
  }

  loadBadgesFromServer() {
    fetch(this.state.url)
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

  componentWillReceiveProps(nextProps) {
    this.setState({ url: nextProps.url, data:[] }, this.loadBadgesFromServer);
  }

  componentDidMount() {
    this.loadBadgesFromServer();
  }

  render() {
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
}

module.exports = BadgeInstanceList;