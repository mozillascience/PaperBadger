var React = require('react');

var Home = React.createClass({
  componentDidMount: function() {
    document.title = "PaperBadger";
  },
  render: function() {
    return (
      <div>Welcome to PaperBadger</div>
    );
  }
});

module.exports = Home;
