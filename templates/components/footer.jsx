var React = require('react');


class Footer extends React.Component {
  render() {
    return (
      <div className="footer l-box is-center">
         <p>This work is a collaboration with publishers <a href="http://www.biomedcentral.com/">BioMed Central</a> (BMC), <a href="http://www.ubiquitypress.com/">Ubiquity Press</a> (UP) and the <a href="http://www.plos.org/">Public Library of Science</a> (PLoS); the biomedical research foundation, <a href="http://www.wellcome.ac.uk/">The Wellcome Trust</a>; the software and technology firm <a href="http://www.digital-science.com/">Digital Science</a>; the registry of unique researcher identifiers, <a href="http://orcid.org/">ORCID</a>; and the <a href="http://mozillascience.org/">Mozilla Science Lab</a>.</p>
      </div>
    );
  }
}

module.exports = Footer;