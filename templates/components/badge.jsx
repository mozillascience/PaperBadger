var React = require('react');


function Badge(props) {
  var badge = props.badge,
      slug = "/v/#/badges/" + badge.slug;
  return (
    <div className="badge pure-u-1-8">
      <a href={slug} >
        <img src={badge.imageUrl}/>
        <span> {badge.name} </span>
      </a>
    </div>
  );
}

module.exports = Badge;