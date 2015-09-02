var React = require('react'),
    Router = require('react-router'),
    Url = require('url'),
    path = require('path'),
    CheckboxGroup = require('react-checkbox-group'),
    Page = require('../components/page.jsx');

var Issue = React.createClass({
  mixins: [ Router.State ],
  loadClaimFromServer: function(slug) {
    fetch('/claims/' + slug)
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then((claim) => {
        this.setState({claim: claim});
    });
  },
  componentWillMount: function() {
    document.title = "Contributorship Badges";
    if(!this.props.user){
      //redirect if user isn't logged in
      window.location.href="/request-orcid-user-auth";
    }
    this.loadClaimFromServer(this.getParams().slug);
  },
  getInitialState: function() {
    return {data: {}, claim: {}};
  },
  claimSubmit: function(e){
    e.preventDefault();
    var claim = this.refs.claim.getDOMNode().value.trim();
    this.loadClaimFromServer(claim);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var orcid = this.refs.orcid.getDOMNode().value.trim();
    var doi = this.refs.doi.getDOMNode().value.trim();
    var badges = this.refs.badges.getCheckedValues();
    var claim = this.state.claim.slug;

    var doiRe = /(10\.\d{3}\d+)\/(.*)\b/;
    var m = doiRe.exec(doi);
    var url = path.join('/papers', m[1],encodeURIComponent(m[2]), 'users', orcid, 'badges');

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({badges: badges, claim: claim})
    })
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then((data) => {
        window.location = '/v/#' + url;
    });
    return;
  },
  render: function() {
    var claim = this.state.claim;

    if(claim.doi){
      return (
        <Page>
          <h1>Issue Badges</h1>
          <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit}>
              <fieldset>
                  <div className="pure-control-group">
                      <label for="orcid">ORCID</label>
                      <input ref="orcid" id="orcid" type="text" value={ this.props.user.orcid }  disabled/>
                  </div>

                  <div className="pure-control-group">
                      <label for="doi">DOI</label>
                      <input ref="doi" id="doi" type="text" value={ claim.doi }  disabled/>
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
    } else {
      return (
        <Page>
          <h1>Issue Badges</h1>
          <p>Check your email for a valid claim code to issue badges for your contributions.</p>
          <form className="pure-form pure-form-aligned" onSubmit={this.claimSubmit}>
              <fieldset>
                  <div className="pure-control-group">
                      <label for="claim">Claim code</label>
                      <input ref="claim" id="claim" type="text"/>
                  </div>

                  <div className="pure-controls">
                      <button type="submit" className="pure-button pure-button-primary">Check</button>
                  </div>
              </fieldset>
          </form>
        </Page>
        );
      }
  }
});

module.exports = Issue;
