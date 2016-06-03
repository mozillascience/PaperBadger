var React = require('react'),
    Page = require('../components/page.jsx');

class fourOhFour extends React.Component {
  componentDidMount() {
    document.title = "PaperBadger: Page Not Found";
  }

  render() {
    return (
      <Page>
        <div>Page not found</div>
      </Page>
    );
  }
}

module.exports = fourOhFour;
