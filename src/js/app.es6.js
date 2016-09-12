
function fetchData(searchTerm) {
  "use strict";

  return Promise.resolve($.ajax({
    url: "https://en.wikipedia.org/w/api.php",
    dataType: "jsonp",
    data: {
      action: "query",
      format: "json",
      prop: "pageimages|pageterms",
      generator: "prefixsearch",
      redirects: "1",
      formatversion: "2",
      piprop: "thumbnail",
      pithumbsize: "50",
      pilimit: "10",
      wbptterms: "description",
      gpssearch: searchTerm,
      gpslimit: "10"
    }
  }))
  .then(data => Promise.resolve(data.query.pages));
}
