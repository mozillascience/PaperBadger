var React = require('react/addons'),
    fetch = require('isomorphic-fetch'),
    Url = require('url'),
    Page = require('../components/page.jsx');

var Issue = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  componentWillMount: function() {
    document.title = "Submit a Paper | Contributorship Badges";
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var doi = this.state.doi;
    var emails = this.state.data.split('\n');
    var path = Url.parse(doi).pathname || doi;
    path = path.split('/');

    var url = '/papers/' + path[path.length-2] + '/' + path[path.length-1];

    fetch(url, {
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify(emails)
    })
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then((data) => {
        document.location = url + '/badges';
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




