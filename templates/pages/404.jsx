var React = require('react');

var fourOhFour = React.createClass({
  componentDidMount: function() {
    document.title = "PaperBadger: Page Not Found";
  },
  render: function() {
    return (
      <div>Page not found</div>
    );
  }
});

module.exports = fourOhFour;
