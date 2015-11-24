# PaperBadger [![Build Status](https://travis-ci.org/mozillascience/PaperBadger.svg)](https://travis-ci.org/mozillascience/PaperBadger)

[![Join the chat at https://gitter.im/mozillascience/PaperBadger](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mozillascience/PaperBadger?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Exploring the use of digital badges for crediting contributors to scholarly papers for their work

As the research environment becomes more digital, we want to test how we can use this medium to help bring transparency and credit for individuals in the publication process.

This work is a collaboration with publishers [BioMed Central](http://www.biomedcentral.com/) (BMC), [Ubiquity Press](http://www.ubiquitypress.com/) (UP) and the [Public Library of Science](http://www.plos.org/) (PLoS); the biomedical research foundation, [The Wellcome Trust](http://www.wellcome.ac.uk/); the software and technology firm [Digital Science](http://www.digital-science.com/); the registry of unique researcher identifiers, [ORCID](http://orcid.org/); and the [Mozilla Science Lab](http://mozillascience.org/).


![Proposed Workflow / Implementation](./public/img/Badges-ProposedWorkflow.jpg)

### Getting Started

Clone PaperBadger and enter the directory: `git clone https://github.com/mozillascience/PaperBadger && cd PaperBadger`

#### Run using Docker

You can use Docker to bring up a quick instance of the app to develop against. This way you dont need to have node or mongo installed on your host.

* Make sure you have [Docker](https://www.docker.com/) and docker-compose installed.
* Setup your environment variables, or copy over the test file
```bash
sed 's/export //' env.test > env.docker
```
* build images and bring up the service
```bash
docker-compose build
docker-compose up
```
* visit the running service
  * If on Linux host: http://localhost:5000
  * If not Linux: http://(docker host ip):5000 (You can find your docker IP with `docker-machine ip default`)


#### Run locally

* Install PaperBadger's Node dependencies: `npm install`
* If you would like to override the default, create `.env` file in your favourite text editor.

`PORT`, `SESSION_SECRET`, `BADGES_ENDPOINT`, `BADGES_KEY`, `BADGES_SECRET`, `BADGES_SYSTEM`, `ORCID_AUTH_CLIENT_ID`, `ORCID_AUTH_CLIENT_SECRET`, `ORCID_AUTH_SITE`, `ORCID_AUTH_TOKEN_PATH` and `ORCID_REDIRECT_URI` environment variables are set to the correct values. `PORT` can be any available port.
If you would like to develop against the hosted custom badgekit-api we have running specificaly for PaperBadger testing, your environment values should look this:

        # default port is 5000
        export PORT=5000
        export SESSION_SECRET=USE_SOMETHING_GOOD_LIKE_puUJjfE6QtUnYryb

        # Badges
        export BADGES_ENDPOINT=http://badgekit-api-sciencelab.herokuapp.com/
        export BADGES_KEY=master
        export BADGES_SECRET=#############
        export BADGES_SYSTEM=badgekit

        # ORCID Auth
        export ORCID_AUTH_CLIENT_ID=#############
        export ORCID_AUTH_CLIENT_SECRET=#############
        export ORCID_AUTH_SITE=#############
        export ORCID_AUTH_TOKEN_PATH=#############
        export ORCID_REDIRECT_URI=#############

Ask @acabunoc for ones marked `###########`. Our custom BadgeKit API code can be found [here](https://github.com/acabunoc/badgekit-api).

* Run `npm start`, and open up `http://localhost:5000/` in your favourite web browser!

### Using the Widget
Researchers earn badges for their specific contributions to an academic paper. A researcher who worked on investigation earns a prestigious investigation badge for that paper.

The PaperBadger widget enables anyone to easily display badges on any website by including just a few lines of script with the relevant doi (digital object identifier) and a designated `<div>` in your view file. Authors can add the script to their own sites to display badges earned, while publishers can use the script to display all badges associated with a paper:

![Badge Preview](./public/img/badge_preview.jpg)

1. To use the widget on your own site, include a `<div>` with your custom class in your view file, for example:
    `<div class="my-container"></div>`

2. Above the closing `<body>` tag, add

    <script type="text/javascript">
       var script = document.createElement("script");
       script.type = "text/javascript";
       script.src = "https://badges.mozillascience.org/widgets/paper-badger-widget.js";
       document.write(decodeURIComponent("%3Cscript src='https://badges.mozillascience.org/widgets/paper-badger-widget.js' type='text/javascript'%3E%3C/script%3E"));
    </script>

3. In your scripts, include your custom class name as the value for the "container-class" key, for example:

```html
    <!DOCTYPE html>

    <html>
    <head>
    <title>Paper view snippet example | Paper Badger</title>
    </head>
    <body>

    <div class="my-container"></div>

    <script type="text/javascript">
       var script = document.createElement("script");
       script.type = "text/javascript";
       script.src = "https://badges.mozillascience.org/widgets/paper-badger-widget.js";
       document.write(decodeURIComponent("%3Cscript src='https://badges.mozillascience.org/widgets/paper-badger-widget.js' type='text/javascript'%3E%3C/script%3E"));
    </script>
    <script>
        var conf={"article-doi": "10.1186/2047-217X-3-18", "container-class": "my-container"};
        showBadges(conf);
    </script>
    </body>
    </html>
```

### Contributing

[Project Roadmap: #17](https://github.com/mozillascience/paperbadger/issues/17)

Please review our contributing guidelines [here](CONTRIBUTING.md)

Want to help? Drop us a line in [this issue](https://github.com/mozillascience/PaperBadger/issues/2).

### API Endpoints

*   GET [/badges](http://badges.mozillascience.org/badges)
    *   Get all badges we issue
*   GET /badges/:badge
    *   Get all badge instances of a certain badge
    *   e.g. [/badges/formal_analysis](http://badges.mozillascience.org/badges/formal_analysis)
*   GET /users/:orcid/badges
    *   Get all badge instances earned by a user
    *   e.g. [/users/0000-0001-5979-8713/badges](http://badges.mozillascience.org/users/0000-0001-5979-8713/badges)
*   GET /users/:orcid/badges/:badge
    *   Get all badge instances of a certain badge earned by a user
    *   e.g. [/users/0000-0001-5979-8713/badges/data_curation](http://badges.mozillascience.org/users/0000-0001-5979-8713/badges/data_curation)
*   GET /papers/:doi1/:doi2/badges
    *   Get all badge instances for a paper.
    *   e.g. [/papers/10.1186/2047-217X-3-18/badges](http://badges.mozillascience.org/papers/10.1186/2047-217X-3-18/badges)
*   GET /papers/:doi1/:doi2/badges/:badge
    *   Get all badge instances of a certain badge for a paper.
    *   e.g. [/papers/10.1186/2047-217X-3-18/badges/investigation](http://badges.mozillascience.org/papers/10.1186/2047-217X-3-18/badges/investigation)
*   GET /papers/:doi1/:doi2/badges/:orcid/badges
    *   Get all badge instances earned by a user for a paper.
    *   e.g. [/papers/10.1186/2047-217X-3-18/users/0000-0001-5979-8713/badges](http://badges.mozillascience.org/papers/10.1186/2047-217X-3-18/users/0000-0001-5979-8713/badges)
*   GET /papers/:doi1/:doi2/badges/:orcid/badges/:badge
    *   Get all badge instances of a certain badge earned by a user for a paper.
    *   e.g. [/papers/10.1186/2047-217X-3-18/users/0000-0001-5979-8713/badges/data_curation](http://badges.mozillascience.org/papers/10.1186/2047-217X-3-18/users/0000-0001-5979-8713/badges/data_curation)
*   POST /papers/:doi1/:doi2/badges/:orcid/badges/:badge
    *   Issue a badge
