# PaperBadger

Exploring the use of digital badges for crediting contributors to scholarly papers for their work

As the research environment becomes more digital, we want to test how we can use this medium to help bring transparency and credit for individuals in the publication process.

This work is a collaboration with publishers [BioMed Central](http://www.biomedcentral.com/) (BMC) and the [Public Library of Science](http://www.plos.org/) (PLoS); the biomedical research foundation, [The Wellcome Trust](http://www.wellcome.ac.uk/); the software and technology firm [Digital Science](http://www.digital-science.com/); the registry of unique researcher identifiers, [ORCID](http://orcid.org/); and the [Mozilla Science Lab](http://mozillascience.org/).


![Proposed Workflow / Implementation](./public/img/Badges-ProposedWorkflow.jpg)

### Getting Started

#### Project Setup

1. Clone PaperBadger and enter the directory: `git clone https://github.com/mozillascience/PaperBadger && cd PaperBadger`
2. Install PaperBadger's Node dependencies: `npm install`
3. Copy the configuration template to its expected location: `cp env.dist .env`
4. Open `.env` in your favourite text editor and ensure that your `PORT`, `BADGES_ENDPOINT`, `BADGES_KEY`, `BADGES_SECRET`, and `BADGES_SYSTEM` environment variables are set to the correct values. `PORT` can be any available port. `BADGES_ENDPOINT`, `BADGES_KEY`, `BADGES_SECRET`, and `BADGES_SYSTEM` should point to the Mozilla Science Lab's version of BadgeKit API at http://badgekit-api-sciencelab.herokuapp.com/. Our custom BadgeKit API code can be found [here](https://github.com/acabunoc/badgekit-api). Run `source .env`.
5. Run `node app.js`, and open up `http://localhost:5000/` in your favourite web browser!

### Contributing

Want to help? Drop us a line in [this issue](https://github.com/mozillascience/PaperBadger/issues/2).