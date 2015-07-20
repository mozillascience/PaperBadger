var React = require('react'),
    fetch = require('isomorphic-fetch'),
    Url = require('url'),
    Page = require('../components/page.jsx');

var Issue = React.createClass({
  email_id: 0,
  componentWillMount: function() {
    document.title = "Submit a Paper | Contributorship Badges";
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var doi = this.refs.doi.getDOMNode().value.trim();
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
        document.location = url;
    });
    return;
  },
  handleAddAuthor: function() {
      var email = {id: this.email_id++};

      var links = this.state.data;
      var newLinks = links.concat([email]);
      this.setState({data: newLinks});
  },
  deleteObj: function(data_id) {
      var emails = this.state.data;
      var newemails = emails.filter(function(elem) {
          return elem.id != data_id;
      });

      this.setState({data: newemails});
  },
  updateObj: function(data_id, value){
    var emails = this.state.data.map(function(elem){
      if(elem.id == data_id){
        elem.value = value;
      }
      return elem;
    });
    this.setState({data:emails});
  },
  getInitialState: function() {
      return {data: [{id: this.email_id++}]};
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
                    <input ref="doi" id="doi" type="text" placeholder="Paper DOI" />
                </div>

                <EmailList data={this.state.data}
                           onUpdate={this.updateObj}
                           onDelete={this.deleteObj} />

                <div className="pure-control-group">
                    <label for="badge"></label>
                    <span onClick={this.handleAddAuthor}><i className="fa fa-plus-circle pure-icon-button"></i> Add an author</span>
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


var EmailList = React.createClass({
    render: function() {
        var onDelete = this.props.onDelete,
            onUpdate = this.props.onUpdate;

        var emails = this.props.data.map(function(email, ind, array) {
          return <Email onDelete={onDelete} onUpdate={onUpdate} email={email} key={email.id}/>;
        });

        return (
            <div>
                {emails}
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




