import React from 'react'
import Page from '../components/page.jsx';


class About extends React.Component {
  componentDidMount() {
    document.title = "About Contributorship Badges";
  }

  render() {
    return (
      <Page>
        <h1>About Contributorship Badges</h1>
        <p>Exploring the use of digital badges for crediting contributors to scholarly papers for their work</p>
        <p>As the research environment becomes more digital, we want to test how we can use this medium to help bring transparency and credit for individuals in the publication process.</p>
        <p>This work is a collaboration with publishers <a href="http://www.biomedcentral.com/">BioMed Central</a> (BMC), <a href="http://www.ubiquitypress.com/">Ubiquity Press</a> (UP) and the <a href="http://www.plos.org/">Public Library of Science</a> (PLoS); the biomedical research foundation, <a href="http://www.wellcome.ac.uk/">The Wellcome Trust</a>; the software and technology firm Digital Science; the registry of unique researcher identifiers, <a href="http://orcid.org/">ORCID</a>; and the <a href="http://mozillascience.org/">Mozilla Science Lab</a>.</p>
      </Page>
      );
  }
}

module.exports = About;
