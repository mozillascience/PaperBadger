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
    var emails = this.state.data.map(function(item){
      return item.value;
    });
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
      return {data: [{id: 0}], email_id:0, doi: ''};
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

                <EmailList data={this.state.data} valueLink={this.linkState("data")} />

                <div className="pure-controls">
                    <button type="submit" className="pure-button pure-button-primary">Submit</button>
                </div>
            </fieldset>
        </form>
      </Page>

      );
  }
});


var EmailList = React.createClass({
    onUpdate: function(id, value) {
      var emails = this.props.data.map(function(elem){
        if(elem.id == id){
          elem.value = value;
        }
        return elem;
      });
      this.props.valueLink.requestChange(emails);
    },
    deleteObj: function(data_id) {
      var emails = this.props.data.filter(function(elem) {
          return elem.id != data_id;
      });
      this.props.valueLink.requestChange(emails);
    },
    handleAddAuthor: function() {
        var email = {id: (this.props.data.length > 0 ? this.props.data[this.props.data.length-1].id + 1 : 0)},
            emails = this.props.data;
        emails.push(email);
      this.props.valueLink.requestChange(emails);
    },
    render: function() {
        var onDelete = this.deleteObj,
            onUpdate = this.onUpdate;

        var emails = this.props.data.map(function(email, ind, array) {
          return <Email onDelete={onDelete} onUpdate={onUpdate} email={email} key={email.id}/>;
        });

        return (
            <div>
                {emails}
                <div className="pure-control-group">
                    <label for="badge"></label>
                    <span onClick={this.handleAddAuthor}><i className="fa fa-plus-circle pure-icon-button"></i> Add an author</span>
                </div>
            </div>
        )
    }
});

var Email = React.createClass({
  deleteObj: function() {
      this.props.onDelete(this.props.email.id);
  },
  updateObj: function() {
    this.props.onUpdate(this.props.email.id, this.refs.email.getDOMNode().value);
  },
  render: function() {
    return (
      <div className="pure-control-group">
                    <label for="badge">Author Email</label>
                    <input ref="email" type="text" placeholder='Email address' onChange={this.updateObj}/>
                    <i onClick={this.deleteObj} className="fa fa-minus-circle pure-icon-button"></i>
                </div>
    );
  }
});

module.exports = Issue;




