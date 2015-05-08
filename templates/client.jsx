var React = require('react'),
    Router = require('react-router'),
    NotFoundRoute = Router.NotFoundRoute,
    Route = Router.Route;

var routes = (
  <Route>
    <Route name="home" path="/" handler={require('./pages/home.jsx')} />
    <Route name="about" path="/about/?" handler={require('./pages/about.jsx')} />
    <NotFoundRoute handler={require('./pages/404.jsx')}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});