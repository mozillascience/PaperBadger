var React = require('react'),
    $ = require('jquery'),
    Url = require('url');

var Issue = React.createClass({
  componentDidMount: function() {
    document.title = "Contributorship Badges";
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var orcid = this.refs.orcid.getDOMNode().value.trim();
    var doi = this.refs.doi.getDOMNode().value.trim();
    var badge = this.refs.badge.getDOMNode().value.trim();

    var path = Url.parse(doi).pathname || doi;
    path = path.split('/');

    var url = '/papers/' + path[path.length-2] + '/' + path[path.length-1] + '/users/' + orcid + '/badges/' + badge;

    $.ajax({
      url: url,
      method: 'POST',
      success: function(data) {
        console.log(data);
        document.location = url;
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    return;
  },
  render: function() {
    return (
      <div>
        <h1>Issue a Badge</h1>
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

      </div>

      );
  }
});

module.exports = Issue;
