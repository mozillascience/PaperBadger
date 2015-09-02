var React = require('react'),
    BadgeInstance = require('./badgeInstance.jsx');

var BadgeInstanceList = React.createClass({
  loadBadgesFromServer: function() {
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
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ url: nextProps.url, data:[] }, this.loadBadgesFromServer);
  },
  getInitialState: function() {
    return {data: [], url:this.props.url};
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