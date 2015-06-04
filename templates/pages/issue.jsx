var React = require('react'),
    fetch = require('isomorphic-fetch'),
    Url = require('url'),
    Page = require('../components/page.jsx');

var Issue = React.createClass({
  componentDidMount: function() {
    document.title = "Contributorship Badges";
    // TODO: need to all get /ORCIDiD if it's null redirect to /request-orcid-user-auth
    // if not the orcid input should be populated
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var orcid = this.refs.orcid.getDOMNode().value.trim();
    var doi = this.refs.doi.getDOMNode().value.trim();
    var badge = this.refs.badge.getDOMNode().value.trim();

    var path = Url.parse(doi).pathname || doi;
    path = path.split('/');

    var url = '/papers/' + path[path.length-2] + '/' + path[path.length-1] + '/users/' + orcid + '/badges/' + badge;

    fetch(url, {
      method: 'post'
    })
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then((data) => {
        document.location = url;
    });
    return;
  },
  render: function() {
    return (
      <Page>
        <h1>Issue a Badge</h1>
        <p>This is a simple prototype demonstrating using a form to issue a badge in the badgekit-api. In future versions we will only allow users to issue badges for their own ORCID (after logging in using ORCID oauth) on papers they have been flagged as a contributor.</p>
        <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit}>
            <fieldset>
                <div className="pure-control-group">
                    <label for="orcid">ORCID</label>
                    <input ref="orcid" id="orcid" type="text" placeholder="Your ORCID" />
                </div>

                <div className="pure-control-group">
                    <label for="doi">DOI</label>
                    <input ref="doi" id="doi" type="text" placeholder="Paper DOI" />
                </div>

                <div className="pure-control-group">
                    <label for="badge">Badge</label>
                    <select ref="badge" id="badge">
                        <option>conceptualization</option>
                        <option>data_curation</option>
                        <option>formal_analysis</option>
                        <option>funding</option>
                        <option>investigation</option>
                        <option>methodology</option>
                        <option>project_administration</option>
                        <option>resources</option>
                        <option>software</option>
                        <option>supervision</option>
                        <option>validation</option>
                        <option>data_visualization</option>
                        <option>writing_initial</option>
                        <option>writing_review</option>
                    </select>
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
