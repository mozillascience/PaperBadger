var React = require('react'),
    fetch = require('isomorphic-fetch'),
    Url = require('url'),
    CheckboxGroup = require('react-checkbox-group'),
    Page = require('../components/page.jsx');

var Issue = React.createClass({
  componentWillMount: function() {
    document.title = "Contributorship Badges";
    if(!this.props.orcid){
      //redirect if user isn't logged in
      window.location.href="/request-orcid-user-auth";
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var orcid = this.refs.orcid.getDOMNode().value.trim();
    var doi = this.refs.doi.getDOMNode().value.trim();
    var badges = this.refs.badges.getCheckedValues();

    var doiRe = /(10\.\d{3}\d+)\/(.*)\b/;
    var m = doiRe.exec(doi);
    var url = '/papers/' + m[1] + '/' + encodeURIComponent(m[2]) + '/users/' + orcid + '/badges';

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({badges: badges})
    })
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then((data) => {
        document.location = url + '?pretty=true';
    });
    return;
  },
  render: function() {
    return (
      <Page>
        <h1>Issue a Badge</h1>
        <p>This is a simple prototype demonstrating using a form to issue a badge in the badgekit-api. In future versions we will only allow users to issue badges on papers they have been flagged as a contributor.</p>
        <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit}>
            <fieldset>
                <div className="pure-control-group">
                    <label for="orcid">ORCID</label>
                    <input ref="orcid" id="orcid" type="text" value={ this.props.orcid }  disabled/>
                </div>

                <div className="pure-control-group">
                    <label for="doi">DOI</label>
                    <input ref="doi" id="doi" type="text" placeholder="Paper DOI" />
                </div>

                <div className="pure-control-group">
                    <label for="badge">Badge</label>
                    <span>Select the roles you contributed to this paper</span>
                </div>
                <div className="pure-controls">
                  <CheckboxGroup name="badges" ref="badges">
                      <label>
                        <input value="conceptualization" type="checkbox" /> Conceptualization
                      </label>
                      <div>Ideas; formulation or evolution of overarching research goals and aims.</div>
                      <label>
                        <input value="data_curation" type="checkbox" /> Data curation
                      </label>
                      <div>Management activities to annotate (produce metadata), scrub data and maintain research data (including software code, where it is necessary for interpreting the data itself) for initial use and later re-use.</div>
                      <label>
                        <input value="formal_analysis" type="checkbox" /> Formal analysis
                      </label>
                      <div>Application of statistical, mathematical, computational, or other formal techniques to analyse or synthesize study data.</div>
                      <label><input value="funding" type="checkbox" /> Funding acquisition </label>
                      <div>Acquisition of the financial support for the project leading to this publication.</div>
                      <label><input value="investigation" type="checkbox" /> Investigation </label>
                      <div>Conducting a research and investigation process, specifically performing the experiments, or data/evidence collection.</div>
                      <label><input value="methodology" type="checkbox" /> Methodology </label>
                      <div>Development or design of methodology; creation of models.</div>
                      <label><input value="project_administration" type="checkbox" /> Project administration </label>
                      <div>Management and coordination responsibility for the research activity planning and execution.</div>
                      <label><input value="resources" type="checkbox" /> Resources </label>
                      <div>Provision of study materials, reagents, materials, patients, laboratory samples, animals, instrumentation, computing resources, or other analysis tools.</div>
                      <label><input value="software" type="checkbox" /> Software </label>
                      <div>Programming, software development; designing computer programs; implementation of the computer code and supporting algorithms; testing of existing code components.</div>
                      <label><input value="supervision" type="checkbox" /> Supervision </label>
                      <div>Oversight and leadership responsibility for the research activity planning and execution, including mentorship external to the core team.</div>
                      <label><input value="validation" type="checkbox" /> Validation </label>
                      <div>Verification, whether as a part of the activity or separate, of the overall replication/reproducibility of results/experiments and other research outputs.</div>
                      <label><input value="data_visualization" type="checkbox" /> Visualization </label>
                      <div>Preparation, creation and/or presentation of the published work, specifically visualization/data presentation.</div>
                      <label><input value="writing_initial" type="checkbox" /> Writing - original draft </label>
                      <div>Preparation, creation and/or presentation of the published work, specifically writing the initial draft (including substantive translation).</div>
                      <label><input value="writing_review" type="checkbox" /> Writing - review & editing </label>
                      <div>Preparation, creation and/or presentation of the published work by those from the original research group, specifically critical review, commentary or revision – including pre- or post-publication stages.</div>
                  </CheckboxGroup>
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
