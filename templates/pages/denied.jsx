var React = require('react'),
    Page = require('../components/page.jsx');

class deniedAccess extends React.Component {
  componentDidMount() {
    document.title = "PaperBadger: User denied access";
  }

  render() {
    return (
      <Page>
        <div>You must sign in to ORCID to be able to issue a badge. <a href="/issue">Try again.</a></div>
      </Page>
    );
  }
}

module.exports = deniedAccess;
