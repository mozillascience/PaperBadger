var React = require('react'),
    Page = require('../components/page.jsx');

var deniedAccess = React.createClass({
  componentDidMount: function() {
    document.title = "PaperBadger: User denied access";
  },
  render: function() {
    return (
      <Page>
        <div>You must sign in to ORCID to be able to issue a badge. <a href="/issue">Try again.</a></div>
      </Page>
    );
  }
});

module.exports = deniedAccess;
