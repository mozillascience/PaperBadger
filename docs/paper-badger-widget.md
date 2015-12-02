# Paper Badger Widget Documentation
This shows what the Paper Badger Widget can do and how to use it.

## Usage
1. To use the widget on your own site, include a `<div>` with your custom class in your view file, for example:
    `<div id="my-container"></div>`

2. Above the closing `<body>` tag, add
  ```html
      <script>
        (function () {
          var d=document,g=d.createElement("script");g.type="text/javascript";g.async=!0;g.defer=!0;
          g.src="https://badges.mozillascience.org/widgets/paper-badger-widget.js";g.onload=load;d.body.appendChild(g);
      
          function load() {
            new PaperBadgerWidget({
              DOI: "10.1186/2047-217X-3-18",
              containerId: "my-container"
            });
          }
        })();
      </script>
  ```

3. In the load method, include your custom values:
  * the element id where your widget will appear for the `containerId` key and
  * either the doi for the paper you are interested in as the `DOI` key or the ORCID for the author you are interesed in as the `ORCID` key
  
## Required configuration options
  * the `containerId` key: contains the id of the element which will contain the Paper Badger widget
  * either the `DOI` or the `ORCID` key: defines which information the widget will display
  
## Optional configuration options
  * the `loaderText` key: changes the default text shown while the Paper Badger widget is loading
  * the `removeClass` key: the widget will remove this class from all elements once it has loaded, if this is a non-empty string
  * the `clickCallback` key: a method that gets called when a link under a badge gets clicked. The method is called with an object containing either the DOI or ORCID of the link and the badge taxonomy:
        ```javascript
        {
            doi: '10.1186/2047-217X-3-18', // either DOI
            orcid: '0000-0001-5207-5061', // or ORCID
            taxonomy: 'data_curation'
        }
        ```
