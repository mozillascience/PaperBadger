var React = require('react');

var About = React.createClass({
  componentDidMount: function() {
    document.title = "About PaperBadger";
  },
  render: function() {
    return (
      <div>About PaperBadger</div>
    );
  }
});

module.exports = About;
