var React = require('react'),
    Link = require('react-router').Link;



function Header(props) {
  return (
    <div className="header">
      <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
        <Link className="pure-menu-heading" to="home">Paper Badger</Link>

        <ul className="pure-menu-list">
            <li className="pure-menu-item pure-menu-selected"><Link to="home" className="pure-menu-link">Home</Link></li>
            <li className="pure-menu-item"><Link to="about" className="pure-menu-link">About</Link></li>
            <li className="pure-menu-item"><Link to="issue" className="pure-menu-link">Issue</Link></li>
        </ul>
    </div>
    </div>
  );
}

module.exports = Header;