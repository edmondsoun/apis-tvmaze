
"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $showEpisodes = $(".Show-getEpisodes")

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchQuery) {

  const searchData = await axios.get(`http://api.tvmaze.com/search/shows`,
    { params: { q: searchQuery } });

  let compressedSearchData = [];

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

  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
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

  console.log(episodeData)
  return episodeData;

  }

/** Handle episode area.
    Accepts an array of episodes.
 *  Appends episodes to DOM when button is clicked. */

function populateEpisodes(episodes) {
  console.log(episodes);
  //
  for (let episode of episodes) {
    const $episode = $(
      `<div data-show-id="${episode.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <div class="media-body">
             <h5 class="text-primary">${episode.name}</h5>
             <h6 class="text-primary">${episode.season}</h5>
             <div><small>${episode.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $episodesArea.append($episode);
  }

}

// /**Handles button click. */
// async function searchForEpisodesAndDisplay() {
//   const episodeID = 
//   //what's episodesArea?
//   $episodesArea.hide();
//   populateShows(shows);
// }

// $showEpisodes.on("click", async function (evt) {
//   evt.preventDefault();
//   console.log($(evt).data(data-show-id))
//   await searchForShowAndDisplay();
// });


