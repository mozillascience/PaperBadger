var React = require('react/addons'),
    Router = require('react-router'),
    Navigation = require('react-router').Navigation,
    path = require('path'),
    Page = require('../components/page.jsx');

var Issue = React.createClass({
  mixins: [React.addons.LinkedStateMixin, Navigation],
  componentWillMount: function() {
    document.title = "Submit a Paper | Contributorship Badges";
  },
  componentDidMount: function() {
    if(!this.props.user){
      //redirect if user isn't logged in
      window.location.href="/request-orcid-user-auth";
    }

    if(this.props.user.role != 'publisher'){
      //redirect home is user isn't a publisher
      this.replaceWith('home');
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var doi = this.state.doi;
    var emails = this.state.data.split('\n');

    var doiRe = /(10\.\d{3}\d+)\/(.*)\b/;
    var m = doiRe.exec(doi);
    var url = path.join('/papers', m[1],encodeURIComponent(m[2]));

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({emails: emails})
    })
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then((data) => {
        this.setState({data: '', doi: ''});
    });
    return;
  },
  getInitialState: function() {
      return {data: '', doi: ''};
  },
  render: function() {
    return (
      <Page>
        <h1>Submit a Paper</h1>
        <p>This is a simple prototype demonstrating using a form to submit papers to Paper Badger, our contributorship badges prototype. In future versions we will integrate with publisher submission pipelines.</p>
        <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit}>
            <fieldset>
                <div className="pure-control-group">
                    <label for="doi">DOI</label>
                    <input type="text" valueLink={this.linkState('doi')} placeholder="Paper DOI" />
                </div>

                <div className="pure-control-group">
                    <label for="authors">Author Emails</label>
                    <textarea valueLink={this.linkState('data')} placeholder="Author emails"></textarea>
                </div>

                <div className="pure-control-group">
                    <label></label>
                    <span>Add each email on a separate line</span>
                </div>

                <div className="pure-controls">
                    <button type="submit" className="pure-button pure-button-primary">Submit</button>
                </div>
            </fieldset>
        </form>
      </Page>

      );
  }
});

module.exports = Issue;