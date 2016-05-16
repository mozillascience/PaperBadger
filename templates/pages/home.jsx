var React = require('react'),
    Link = require('react-router').Link,
    Page = require('../components/page.jsx'),
    BadgeList = require('../components/badgelist.jsx');

var Home = React.createClass({
  componentDidMount: function() {
    document.title = "Contributorship Badges";
  },
  handleClick: function(i){
    console.log(i);
  },
  render: function() {
    return (
      <Page splash>
        <h2>Explore Badges</h2>
        <ul>
          <li><Link to="issue">Issue a badge</Link></li>
          <li><a href="/v/#/users/0000-0003-4959-3049/badges">Browse issued badges for ORCID 0000-0003-4959-3049</a></li>
          <li><a href="v/#/badges/formal_analysis">Browse all formal analysis badges</a></li>
        </ul>
        <h2>Badges</h2>
        <BadgeList />
        <h2>API Endpoints</h2>
        <ul>
          <li>GET <a href="/badges?pretty=true">/badges</a>
            <ul>
              <li>Get all badges we issue</li>
            </ul>
          </li>
          <li>GET /badges/:badge
            <ul>
              <li>Get all badge instances of a certain badge</li>
              <li>e.g. <a href="/badges/formal_analysis?pretty=true">/badges/formal_analysis</a></li>
            </ul>
          </li>
          <li>GET /users/:orcid/badges
            <ul>
              <li>Get all badge instances earned by a user</li>
              <li>e.g. <a href="/users/0000-0001-5979-8713/badges?pretty=true">/users/0000-0001-5979-8713/badges</a></li>
            </ul>
          </li>
          <li>GET /users/:orcid/badges/count
            <ul>
              <li>Get a count of all badge instances earned by a user</li>
              <li>e.g. <a href="/users/0000-0001-5979-8713/badges/count">/users/0000-0001-5979-8713/badges/count</a></li>
            </ul>
          </li>
          <li>GET /users/:orcid/badges/:badge
            <ul>
              <li>Get all badge instances of a certain badge earned by a user</li>
              <li>e.g. <a href="/users/0000-0001-5979-8713/badges/data_curation?pretty=true">/users/0000-0001-5979-8713/badges/data_curation</a></li>
            </ul>
          </li>
          <li>GET /papers/:doi1/:doi2/badges
            <ul>
              <li>Get all badge instances for a paper.</li>
               <li>e.g. <a href="/papers/10.1186/2047-217X-3-18/badges?pretty=true">/papers/10.1186/2047-217X-3-18/badges</a></li>
            </ul>
          </li>
          <li>GET /papers/:doi1/:doi2/badges/count
            <ul>
              <li>Get a count of all badge instances for a paper.</li>
              <li>e.g. <a href="/papers/10.1186/2047-217X-3-18/badges/count">/papers/10.1186/2047-217X-3-18/badges/count</a></li>
            </ul>
          </li>
          <li>GET /papers/:doi1/:doi2/badges/:badge
            <ul>
              <li>Get all badge instances of a certain badge for a paper.</li>
              <li>e.g. <a href="/papers/10.1186/2047-217X-3-18/badges/investigation?pretty=true">/papers/10.1186/2047-217X-3-18/badges/investigation</a></li>
            </ul>
          </li>
          <li>GET /papers/:doi1/:doi2/badges/:badge/count
            <ul>
              <li>Get a count of all badge instances of a certain badge for a paper.</li>
              <li>e.g. <a href="/papers/10.1186/2047-217X-3-18/badges/investigation/count">/papers/10.1186/2047-217X-3-18/badges/investigation/count</a></li>
            </ul>
          </li>
          <li>GET /papers/:doi1/:doi2/users/:orcid/badges
            <ul>
              <li>Get all badge instances earned by a user for a paper.</li>
              <li>e.g. <a href="/papers/10.1186/2047-217X-3-18/users/0000-0001-5979-8713/badges?pretty=true">/papers/10.1186/2047-217X-3-18/users/0000-0001-5979-8713/badges</a></li>
            </ul>
          </li>
          <li>GET /papers/:doi1/:doi2/users/:orcid/badges/:badge
            <ul>
              <li>Get all badge instances of a certain badge earned by a user for a paper.</li>
              <li>e.g. <a href="/papers/10.1186/2047-217X-3-18/users/0000-0001-5979-8713/badges/data_curation?pretty=true">/papers/10.1186/2047-217X-3-18/users/0000-0001-5979-8713/badges/data_curation</a></li>
            </ul>
          </li>
          <li>POST /papers/:doi1/:doi2/users/:orcid/badges/:badge
            <ul>
              <li>Issue a badge</li>
            </ul>
          </li>
        </ul>
      </Page>
    );
  }
});

module.exports = Home;
