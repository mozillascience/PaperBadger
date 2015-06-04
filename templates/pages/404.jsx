var React = require('react'),
    Page = require('../components/page.jsx');

var fourOhFour = React.createClass({
  componentDidMount: function() {
    document.title = "PaperBadger: Page Not Found";
  },
  render: function() {
    return (
      <Page>
        <div>Page not found</div>
      </Page>
    );
  }
});

module.exports = fourOhFour;
