var React = require('react'),
    Link = require('react-router').Link,
    BadgeList = require('../components/badgelist.jsx')

var Home = React.createClass({
  componentDidMount: function() {
    document.title = "Contributorship Badges";
  },
  handleClick: function(i){
    console.log(i);
  },
  render: function() {
    return (
      <div>
        <div>
        <h1>Contributorship Badges</h1>
        <p>Exploring the use of digital badges for crediting contributors to scholarly papers for their work. <Link to="about">More about contributorship badges.</Link></p>
        </div>
        <h2>Explore Badges</h2>
        <ul>
          <li><Link to="issue">Issue a badge</Link></li>
          <li><span onClick={this.handleClick.bind(this, "/users/0000-0003-4959-3049/badges")} href="/users/0000-0003-4959-3049/badges">Browse issued badges for ORCID 0000-0003-4959-3049</span> (JSON endpoint)</li>
          <li><a href="/badges/formal_analysis">Browse all formal analysis badges</a> (JSON endpoint)</li>
        </ul>
        <h2>Badges</h2>
        <BadgeList />
        <h2>API Endpoints</h2>
        <ul>
          <li>GET <a href="/badges">/badges</a>
            <ul>
              <li>Get all badges we issue</li>
            </ul>
          </li>
          <li>GET /badges/:badge
            <ul>
              <li>Get all badge instances of a certain badge</li>
              <li>e.g. <a href="/badges/formal_analysis">/badges/formal_analysis</a></li>
            </ul>
          </li>
          <li>GET /users/:orcid/badges
            <ul>
              <li>Get all badge instances earned by a user</li>
              <li>e.g. <a href="/users/0000-0003-4959-3049/badges">/users/0000-0003-4959-3049/badges</a></li>
            </ul>
          </li>
          <li>GET /users/:orcid/badges/:badge
            <ul>
              <li>Get all badge instances of a certain badge earned by a user</li>
              <li>e.g. <a href="/users/0000-0003-4959-3049/badges/investigation">/users/0000-0003-4959-3049/badges/investigation</a></li>
            </ul>
          </li>
          <li>GET /papers/:doi1/:doi2/badges (not implemented)
            <ul>
              <li>Get all badge instances for a paper.</li>
            </ul>
          </li>
          <li>GET /papers/:doi1/:doi2/badges/:badge
            <ul>
              <li>Get all badge instances of a certain badge for a paper.</li>
              <li>e.g. <a href="/papers/10.1371/journal.pbio.1002126/badges/investigation">/papers/10.1371/journal.pbio.1002126/badges/investigation</a></li>
            </ul>
          </li>
          <li>GET /papers/:doi1/:doi2/badges/:orcid/badges
            <ul>
              <li>Get all badge instances earned by a user for a paper.</li>
              <li>e.g. <a href="/papers/10.1371/journal.pbio.1002126/users/0000-0003-4959-3049/badges">/papers/10.1371/journal.pbio.1002126/users/0000-0003-4959-3049/badges</a></li>
            </ul>
          </li>
          <li>GET /papers/:doi1/:doi2/badges/:orcid/badges/:badge
            <ul>
              <li>Get all badge instances of a certain badge earned by a user for a paper.</li>
              <li>e.g. <a href="/papers/10.1371/journal.pbio.1002126/users/0000-0003-4959-3049/badges/investigation">/papers/10.1371/journal.pbio.1002126/users/0000-0003-4959-3049/badges/investigation</a></li>
            </ul>
          </li>
          <li>POST /papers/:doi1/:doi2/badges/:orcid/badges/:badge
            <ul>
              <li>Issue a badge</li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
});

module.exports = Home;
