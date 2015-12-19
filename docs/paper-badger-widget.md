# paper-badger-widget.js Documentation
1. To use the widget on your own site, include a `<div>` with your custom class in your view file, for example:
    `<div class="my-container"></div>`

2. Above the closing `<body>` tag, add

  ```html
      <script type="text/javascript">
         var script = document.createElement("script");
         script.type = "text/javascript";
         script.src = "https://badges.mozillascience.org/widgets/paper-badger-widget.js";
         document.write(decodeURIComponent("%3Cscript src='https://badges.mozillascience.org/widgets/paper-badger-widget.js' type='text/javascript'%3E%3C/script%3E"));
      </script>
  ```

3. In your scripts, include your custom values:
  * the class name where your widget will appear for the `container-class` key and
  * the doi for the paper you are interested in as the `article-doi` key

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