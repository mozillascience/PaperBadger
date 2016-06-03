/* jshint esversion: 6 */
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import HomePage from './pages/home.jsx'
import AboutPage from './pages/about.jsx'
import IssuePage from './pages/issue.jsx'
import DeniedPage from './pages/denied.jsx'
import NewPaperPage from './pages/paper.jsx'
import ViewPage from './pages/view.jsx'
import NotFoundPage from './pages/404.jsx'

fetch('/user', {
  credentials: 'same-origin'
})
.then((response) => {
  if (response.status >= 400) {
      throw new Error("Bad response from server");
  }
  let user = response.json();

  render((
    <Router history={browserHistory}>
      <Route path="/" component={HomePage}/>
      <Route path="/about" component={AboutPage} />
      <Route path="/issue(/:slug)" component={IssuePage} />
      <Route path="/denied/?" component={DeniedPage} />
      <Route path="/papers/new" component={NewPaperPage} />
      <Route path="/v/*" component={ViewPage} />
      <Route path="/*" component={NotFoundPage}/>
    </Router>
  ), document.getElementById('app'));

  // FIXME user is not passed
  /*
    Router.run(routes, Router.HistoryLocation, function (Handler) {
      render(<Handler user={user}/>, document.body);
    });
  */
});
