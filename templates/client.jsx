var React = require('react'),
    Router = require('react-router'),
    NotFoundRoute = Router.NotFoundRoute,
    Route = Router.Route;

var routes = (
  <Route>
    <Route name="home" path="/" handler={require('./pages/home.jsx')} />
    <Route name="about" path="/about/?" handler={require('./pages/about.jsx')} />
    <Route name="issue" path="/issue/:slug?/?" handler={require('./pages/issue.jsx')} />
    <Route name="denied" path="/denied/?" handler={require('./pages/denied.jsx')} />
    <Route name="new-paper" path="/papers/new" handler={require('./pages/paper.jsx')} />
    <Route name="view" path="/v/?" handler={require('./pages/view.jsx')} />
    <NotFoundRoute handler={require('./pages/404.jsx')}/>
  </Route>
);


fetch('/user', {
  credentials: 'same-origin'
})
.then((response) => {
  if (response.status >= 400) {
      throw new Error("Bad response from server");
  }
  return response.json();
})
.then((user) => {
  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler user={user}/>, document.body);
  });
});
