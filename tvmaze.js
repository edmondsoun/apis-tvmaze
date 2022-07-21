
"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchQuery) {

  // return JSON object with values that match search query
  const searchData = await axios.get(`http://api.tvmaze.com/search/shows`,
    { params: { q: searchQuery } });

  let compressedSearchData = [];

  // take the JSON object
  // iterate through the array
  // filter each object located at each array index
  // return new array with filtered object
  for (let showIndex of searchData.data) {
    let newObject = {};
    newObject.id = showIndex.show.id;
    newObject.name = showIndex.show.name;
    newObject.summary = showIndex.show.summary;
    newObject.image = showIndex.show.image; //could make into a ternary operator
    if (newObject.image === null) { //falsy check and make image into a global variable
      console.log("image not found")
      newObject.image = { 'medium': "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300" };
    }
    console.log(newObject)
    //push resulting object to new array
    compressedSearchData.push(newObject);
  }

  return compressedSearchData;

}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  //const $showsList = $("#showsList");
  // empties show list in DOM
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image.medium}
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  //what's episodesArea?
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

 async function getEpisodesOfShow(id) {
  const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodeData= [];

  for (let showIndex of episodes.data) {
    let newObject = {};
    newObject.id = showIndex.id;
    newObject.name = showIndex.name;
    newObject.season = showIndex.season;
    newObject.summary = showIndex.summary;
    if (newObject.image === null) { //possible refactor later
      console.log("image not found")
      newObject.image = { 'medium': "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300" };
    }
    console.log(newObject)
    //push resulting object to new array
    episodeData.push(newObject);
  }

  return episodeData;


  }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }




// potential code for episodes

//
// return episodes.data;