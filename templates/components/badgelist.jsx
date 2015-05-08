var React = require('react'),
    Badge = require('./badge.jsx'),
    $ = require('jquery');

var BadgeList = React.createClass({
  loadUsersFromServer: function() {
    $.ajax({
      url: "/badges",
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
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