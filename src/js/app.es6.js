
(function WikipediaViewer() {
  "use strict";

  const SUBMIT = $(".searchBox-submit");
  const RANDOM = $(".searchBox-random");
  const INPUT = $(".searchBox-input");
  const RESULTS = $(".results");

  SUBMIT.click(function displayResults() {
    RESULTS.empty();

    fetchData(INPUT.val())
    .then(data => data.forEach(createResultDiv));
  });

  RANDOM.click(function() {
    window.open("https://en.wikipedia.org/wiki/Special:Random");
  });

  function fetchData(searchTerm) {
    // opensearch an array with the following form:
    // [searchTerm, [titles...], [descriptions...], [links...]]
    // The inner arrays are parallel to each other.
    // I wish it returned an array of objects instead.
    return Promise.resolve($.ajax({
      url: "https://en.wikipedia.org/w/api.php",
      dataType: "json",
      data: {
        action: "opensearch",
        format: "json",
        origin: "*",
        search: searchTerm,
        formatversion: "2"
      }
    }))
    .then(function ([ , titles, descriptions, urls]) {
      // Remember! If the RHS of the arrow symbol is intended to be an object,
      // wrap in parens. Otherwise JS will think of it as a "function block".
      return titles.map((title, index) => ({
        title,
        description: descriptions[index],
        url: urls[index]
      }));
    });
  }

  function createResultDiv({title, description, url}) {
    var div = $("<div></div>")
      .addClass("results-item")
      .appendTo(RESULTS);

    var divTitle = $("<h2></h2>")
      .addClass("results-item-title")
      .appendTo(div);

    $("<a></a>")
      .attr({
        href: url,
        target: "_blank"
      })
      .text(title)
      .appendTo(divTitle);

    $("<p></p>")
      .addClass("results-item-description")
      .text(description)
      .appendTo(div);
  }
})();
