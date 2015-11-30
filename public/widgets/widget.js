/* global ActiveXObject: false */
/* exported PaperBadgerWidget */
/**
 * PaperBadger widget
 * Displays all badges for a DOI or ORCID.
 *
 * @param {Object} settings
 * @param {string=} settings.DOI
 * @param {string=} settings.ORCID
 * @param {string}  settings.containerId
 * @param {string=} settings.loaderText
 * @constructor
 */
var PaperBadgerWidget = function (settings) {
  /**
   * Widget container element
   * @type {Element}
   */
  var containerElement;

  /**
   * String shown in the loading animation
   * @type {string}
   */
  var loaderText = "loading widget";

  /**
   * Element for the loading animation
   * @type {Element}
   */
  var loaderElement;

  /**
   * Contains the interval id for the animation loop
   * @type {Number}
   */
  var loaderInterval;

  /**
   * Checks the settings given to the function and starts
   * the widget creation.
   */
  var construct = function () {
    // fix for #135, all but the first forward slash of a DOI
    // should be encoded as %2F
    if (settings.hasOwnProperty("DOI")) {
      var tmp = settings.DOI.split("/");
      settings.DOI = tmp[0] + "/" + tmp.slice(1).join("%2F");
    }

    containerElement = document.getElementById(settings.containerId);

    if (settings.hasOwnProperty("loaderText")) {
      loaderText = settings.loaderText;
    }

    // we need a container element and either a DOI or an ORCID
    // proceed if these are available, throw an error if not
    if (containerElement && (settings.hasOwnProperty("DOI") || settings.hasOwnProperty("ORCID"))) {
      insertCSS();
      startLoader();
      loadWidgetContent();
    } else {
      throw "The settings object is incomplete. You need to supply an element id and either a DOI or an ORCID.";
    }
  };

  /**
   * Injects a style tag into the header containing the necessary
   * styles for the widget.
   */
  var insertCSS = function () {
    var css = ".paper-badge {float: left; width: 10em; height: 20em; overflow: hidden; " +
      "border-top: 1px solid #ccc; height 15em; padding: 2%; margin-right: 1%; margin-top: 2%}" +
      ".paper-badge a {width: 100%; display: inline-block; font-size: 88%; line-height: 1.2; " +
      "color: #333; padding: 0.4em; cursor: pointer; text-decoration: none} .paper-badge " +
      "a.active {color: #fff; background: #7ab441; text-decoration: none} .paper-badge img " +
      "{max-width: 8em; margin-left: 10%; margin-bottom: 1%}";

    var head = document.head || document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  };

  /**
   * Inserts the loader element into the container element
   * and starts an animation loop.
   */
  var startLoader = function () {
    loaderElement = document.createElement("div");
    loaderElement.className = "paperbadger-loader";
    loaderElement.setAttribute("data-step", "4");
    containerElement.appendChild(loaderElement);
    loaderMethod();

    loaderInterval = setInterval(loaderMethod, 750);
  };

  /**
   * Animation loop for the loader text. Adds / removes
   * dots from the loader text.
   */
  var loaderMethod = function () {
    var step = loaderElement.getAttribute("data-step");
    var text = loaderText;

    if (step === "4") {
      step = 1;
    } else if (step === "1") {
      step = 2;
      text += ".";
    } else if (step === "2") {
      step = 3;
      text += "..";
    } else if (step === "3") {
      step = 4;
      text += "...";
    }

    loaderElement.innerHTML = text;
    loaderElement.setAttribute("data-step", step);
  };

  /**
   * Stops the loader animation loop.
   */
  var stopLoader = function () {
    clearInterval(loaderInterval);
  };

  /**
   * Loads the widget content from the Badges API.
   */
  var loadWidgetContent = function () {
    var url = getEndpoint();
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        stopLoader();
        processAjaxResponse(xmlhttp.responseText);
      }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  };

  /**
   * Generates the endpoint url depending on the
   * widget settings.
   *
   * @returns {string}
   */
  var getEndpoint = function () {
    var url = "https://badges.mozillascience.org/";

    if (settings.DOI) {
      url += "papers/" + settings.DOI;
    } else if (settings.ORCID) {
      url += "users/" + settings.ORCID;
    } else {
      throw "You need to supply either a DOI or an ORCID.";
    }

    url += "/badges";

    return url;
  };

  /**
   * Processes the data from the Badges API so it
   * can be rendered in the next step.
   *
   * @param {string} json
   */
  var processAjaxResponse = function (json) {
    var badgesJson = JSON.parse(json);
    var badges = {};
    var isDOI = (settings.hasOwnProperty("DOI") && settings.DOI.length);

    for (var i = 0; i < badgesJson.length; i++) {
      var badgeId = badgesJson[i].badge.slug;
      if (!badges.hasOwnProperty(badgeId)) {
        badges[badgeId] = {
          name: badgesJson[i].badge.name,
          consumerDescription: badgesJson[i].badge.consumerDescription,
          imageUrl: badgesJson[i].badge.imageUrl,
          links: []
        };
      }

      // depending whether we have a DOI or an ORCID display a list
      // of either authors or articles for a badge
      if (isDOI) {
        badges[badgeId].links.push({
          id: badgesJson[i].orcid,
          text: badgesJson[i].authorName,
          url: "https://orcid.org/" + badgesJson[i].orcid
        });
      } else {
        var localDOI = badgesJson[i].evidenceUrl.split("doi.org/")[1];

        badges[badgeId].links.push({
          id: localDOI,
          text: localDOI,
          url: badgesJson[i].evidenceUrl.replace("http:", "https:")
        });
      }
    }

    renderBadges(badges);
  };

  /**
   * Generates and displays the HTML code for the received
   * badge data.
   *
   * @param {Object} badges
   */
  var renderBadges = function (badges) {
    var i = 0;
    var html = "";

    for (var key in badges) {
      if (badges.hasOwnProperty(key)) {
        html += "<div class=\"paper-badge\">";
        html += "<img src=\"" + badges[key].imageUrl + "\" alt=\"" + badges[key].name + "\"" +
          " title=\"" + badges[key].consumerDescription + "\">";

        for (i = 0; i < badges[key].links.length; i++) {
          html += "<a href=\"" + badges[key].links[i].url + "\" class=\"paper-badger-link\" " +
            "data-id=\"" + badges[key].links[i].id + "\">" + badges[key].links[i].text + "</a>";
        }

        html += "</div>";
      }
    }

    containerElement.innerHTML = html;

    // add mouseover for links only
    var links = document.getElementsByClassName("paper-badger-link");
    for (i = 0; i < links.length - 1; i++) {
      links[i].addEventListener("mouseover", mouseOverMethod);
    }
  };

  /**
   * Marks all occurrences of an author on mouse over
   * by adding a .active CSS class to the link element.
   */
  var mouseOverMethod = function () {
    var id = this.getAttribute("data-id");
    var links = document.getElementsByClassName("paper-badger-link");

    for (var i = 0; i < links.length; i++) {
      var j = 0;
      var classes = links[i].className.split(" ");

      if (links[i].getAttribute("data-id") === id) {
        var found = false;
        for (j = 0; j < classes.length - 1; j++) {
          if (classes[j] === "active") {
            found = true;
            break;
          }
        }

        if (!found) {
          classes.push("active");
        }
      } else {
        for (j = classes.length; j > 0; j--) {
          if (classes[j] === "active") {
            classes.splice(j, 1);
          }
        }
      }

      links[i].className = classes.join(" ");
    }
  };

  construct();
};
