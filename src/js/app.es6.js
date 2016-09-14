
(function WikipediaViewer() {
  "use strict";

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
})();
