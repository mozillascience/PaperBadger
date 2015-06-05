var React = require('react'),
    Router = require('react-router'),
    NotFoundRoute = Router.NotFoundRoute,
    Route = Router.Route;

var routes = (
  <Route>
    <Route name="home" path="/" handler={require('./pages/home.jsx')} />
    <Route name="about" path="/about/?" handler={require('./pages/about.jsx')} />
    <Route name="issue" path="/issue/?" handler={require('./pages/issue.jsx')} />
    <NotFoundRoute handler={require('./pages/404.jsx')}/>
  </Route>
);

var App = {
  init: function (orcid) {
    Router.run(routes, Router.HistoryLocation, function (Handler) {
      React.render(<Handler orcid={orcid} />, document.body);
    });
  }
}

// expose App so that I can pass user orcid information on load
window.App = App;
