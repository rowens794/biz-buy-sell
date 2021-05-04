const axios = require("axios");
const cheerio = require("cheerio");

const Listing = require("../models/Listing");

exports.getStateListings = async (req, res) => {
  res.send("getting state data");
  let states = [
    // "pennsylvania",
    // "kentucky",
    // "north-carolina",
    // "maryland",
    // "michigan",
    // "new-york",
    // "south-carolina",
    // "ohio",
    // "west-virginia",
    // "virginia",
    // "indiana",
    // "alabama",
    // "alaska",
    // "arizona",
    // "arkansas",
    // "california",
    "colorado",
    "connecticut",
    "delaware",
    "florida",
    "georgia",
    "hawaii",
    "idaho",
    "illinois",
    "iowa",
    "kansas",
    "louisiana",
    "maine",
    "massachusetts",
    "minnesota",
    "mississippi",
    "missouri",
    "montana",
    "nebraska",
    "nevada",
    "new-hampshire",
    "new-jersey",
    "new-mexico",
    "new-york",
    "north-dakota",
    "oklahoma",
    "oregon",
    "rhode-island",
    "south-dakota",
    "tennessee",
    "texas",
    "utah",
    "vermont",
    "washington",
    "wisconsin",
    "wyoming",
  ];

  for (let j = 0; j < states.length; j++) {
    let stateListings = await getState(states[j]);
    await saveListingsToDB(stateListings, states[j]);
  }

  console.log("done");
};

const getState = (state) => {
  let allListings = {};

  let promise = new Promise(async (resolve, reject) => {
    let keepSearching = true;
    let startingPage = 1;

    while (keepSearching) {
      console.log(`Page ${startingPage} - ${state}`);
      let res = await axios.get(`https://www.bizbuysell.com/${state}-established-businesses-for-sale/${startingPage}`);
      let html = res.data;
      let newListings = getPageListings(html);

      //validate new listings
      if (validateListingsAreNew(allListings, newListings)) {
        allListings = { ...allListings, ...newListings };
        await pauseExecution(100);

        //increment starting page
        startingPage += 1;
      } else {
        keepSearching = false;
      }
    }

    resolve(allListings);
  });

  return promise;
};

const getPageListings = (html) => {
  const $ = cheerio.load(html);
  let listings = {};

  //parse all page listings
  $("div .listing").each(function (i, elm) {
    let title = $(elm).find("h3").text();
    let price = $(elm).find(".asking-price").text();
    let location = $(elm).find(".location").text();
    let description = $(elm).find(".description").text();
    let link = $(elm).parent().attr("href");
    price = price ? price.split("?")[0] : null;
    link = link ? link.split("?")[0] : null;

    if (title && link) {
      listings[link] = {
        title,
        price,
        location,
        description,
        link,
      };
    }
  });

  return listings;
};

const validateListingsAreNew = (allListings, newListings) => {
  let newListingKeys = Object.keys(newListings);
  let firstKey = newListingKeys[0];

  if (firstKey && !allListings[firstKey]) {
    return true;
  } else {
    return false;
  }
};

const pauseExecution = (base) => {
  let promise = new Promise((resolve, reject) => {
    //pause for random amount of time
    let pauseTime = Math.random() * 2000 + base;
    setTimeout(() => {
      resolve(true);
    }, pauseTime);
  });

  return promise;
};

const saveListingsToDB = (listings, state) => {
  let promise = new Promise(async (resolve, reject) => {
    let keys = Object.keys(listings);
    for (let i = 0; i < keys.length; i++) {
      let listing = listings[keys[i]];
      let dbDoc = new Listing({
        title: listing.title,
        price: listing.price,
        location: listing.location,
        state: state,
        desc: listing.description,
        link: listing.link,
        date: new Date(),
        listingPageScraped: false,
      });

      await dbDoc.save();
    }

    resolve(true);
  });

  return promise;
};
