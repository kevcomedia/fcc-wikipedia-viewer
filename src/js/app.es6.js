
(function WikipediaViewer() {
  "use strict";

  const $submit = $(".searchBox-submit");
  const $random = $(".searchBox-random");
  const $input = $(".searchBox-input");
  const $results = $(".results");

  $submit.click(function displayResults() {
    $results.empty()
      .append($("<div class='results-spinner'>")
        .append($("<span class='fa fa-circle-o-notch fa-spin fa-3x fa-fw'>")
        )
      );

    fetchData($input.val())
    .then(
      data => {
        $results.empty();
        data.forEach(createResultDiv);
      },
      data => $results.empty());
  });

  $input.keypress(function displayResults(e) {
    if (e.which == 13) {
      $submit.click();
    }
  });

  $random.click(function openRandomArticle() {
    window.open("https://en.wikipedia.org/wiki/Special:Random");
  });

  function fetchData(searchTerm) {
    // opensearch returns an array with the following form:
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
    .then(function convertToObjects([ , titles, descriptions, urls]) {
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
      .appendTo($results);

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
