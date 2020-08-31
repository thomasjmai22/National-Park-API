"use strict";

const api_key = "Ua2XDxAeghhTyQ4BgPZk41TfugEu31IidfPUqwIK";
const searchURL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  console.log(responseJson);
  $("#results-list").empty();

  for (let i = 0; i < responseJson.data.length; i++) {
    $("#results-list").append(
      `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
      <p>${responseJson.data[i].description}</p>
      <img src='${responseJson.data[i].images[0].url}'>
      </li>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}

function getparks(stateCode, limit = 10) {
  const params = {
    api_key,
    stateCode,
    limit,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  console.log(url);
  //fetch(`${url}?api_key=${api_key}&stateCode=${stateCode}&limit=${limit}`)
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    // const parkCode = "https://api.nps.gov/api/v1/parks";
    const stateCode = $("#js-search-term")
      .val()
      .split("," + " ");
    const maxResults = $("#js-max-results").val();
    getparks(stateCode, maxResults);
  });
}

$(watchForm);
