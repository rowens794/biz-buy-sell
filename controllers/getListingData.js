const axios = require("axios");
const cheerio = require("cheerio");

const Listing = require("../models/Listing");

exports.getListings = async (req, res) => {
  res.send("getting listing");
  let stateString = states[req.params.state];
  let listings = await Listing.find({ listingPageScraped: false, state: stateString });
  // let listings = await Listing.find({});

  for (let i = 0; i < listings.length; i++) {
    console.log(`${i} of ${listings.length}`);
    let listing = listings[i];
    let pageData = await getLambdaListing(listing.link);
    if (pageData) await updateListing(listing, pageData);
    await pauseExecution(250);
  }
  console.log("done");
};

exports.getListingsOne = async (req, res) => {
  res.send("getting listing1");
  let statesToFind = Object.keys(states);
  statesToFind = statesToFind.map((key) => states[key]);
  statesToFind = statesToFind.slice(0, 25);
  let listings = await Listing.find({ listingPageScraped: false, state: { $in: statesToFind } });
  // let listings = await Listing.find({});

  for (let i = 0; i < listings.length; i++) {
    console.log(`${i} of ${listings.length}`);
    let listing = listings[i];
    let pageData = await getLambdaListing(listing.link);
    if (pageData) await updateListing(listing, pageData);
    await pauseExecution(250);
  }
  console.log("done");
};

exports.getListingsTwo = async (req, res) => {
  res.send("getting listing 2");
  let statesToFind = Object.keys(states);
  statesToFind = statesToFind.map((key) => states[key]);
  statesToFind = statesToFind.slice(25, statesToFind.length);
  let listings = await Listing.find({ listingPageScraped: false, state: { $in: statesToFind } });

  for (let i = 0; i < listings.length; i++) {
    console.log(`${i} of ${listings.length}`);
    let listing = listings[i];
    let pageData = await getLambdaListing(listing.link);
    if (pageData) await updateListing(listing, pageData);
    await pauseExecution(250);
  }
  console.log("done");
};

const getListing = (url) => {
  let fullurl = `https://www.bizbuysell.com${url}`;
  let promise = new Promise(async (resolve, reject) => {
    let pageData = {};

    let res = null;
    try {
      res = await await axios.get(fullurl);
    } catch (err) {
      console.log(`error fetching: ${fullurl}`);
    }

    if (res) {
      let html = res.data;

      //initialize cheerio
      const $ = cheerio.load(html);

      //primary info
      pageData.cashFlow = $('span:contains("Cash Flow:")').parent().find("b").text().trim();
      pageData.price = $('span:contains("Asking Price:")').parent().find("b").text().trim();
      pageData.grossRevenue = $('span:contains("Gross Revenue:")').parent().find("b").text().trim();
      pageData.ebitda = $('span:contains("EBITDA:")').parent().find("b").text().trim();
      pageData.ffe = $('span:contains("FF&E:")').parent().find("b").text().trim();
      pageData.inventory = $('span:contains("Inventory:")').parent().find("b").text().trim();
      pageData.realEstate = $('span:contains("Real Estate:")').parent().find("b").text().trim();
      pageData.established = $('span:contains("Established:")').parent().find("b").text().trim();
      pageData.rent = $('span:contains("Rent:")').parent().find("b").text().trim();
      pageData.location = $('dt:contains("Location:")').next().text();
      pageData.inventory2 = $('dt:contains("Inventory:")').next().text();
      pageData.realEstate2 = $('dt:contains("Real Estate:")').next().text();
      pageData.buildingSF = $('dt:contains("Building SF:")').next().text();
      pageData.leaseExpiration = $('dt:contains("Lease Expiration:")').next().text();
      pageData.ffe2 = $('dt:contains("Furniture, Fixtures, & Equipment (FF&E):")').next().text();
      pageData.facilities = $('dt:contains("Facilities:")').next().text();
      pageData.competition = $('dt:contains("Competition:")').next().text();
      pageData.growth = $('dt:contains("Growth & Expansion:")').next().text();
      pageData.financing = $('dt:contains("Financing:")').next().text();
      pageData.supportTraining = $('dt:contains("Support & Training:")').next().text();
      pageData.sellingReason = $('dt:contains("Reason for Selling:")').next().text();
      pageData.homeBased = $('dt:contains("Home-Based:")').next().text();
      pageData.franchise = $('dt:contains("Franchise:")').next().text();
      pageData.website = $('dt:contains("Business Website:")').next().text();
      pageData.adLine = $(".profileAdLine").text().trim();
      pageData.businessDescription = $("div .businessDescription").text().trim();
      pageData.broker = $("div .broker").text()
        ? $("div .broker").text().replace(/\s/g, "").replace("PhoneNumber", " ").replace("BusinessListedBy:", "")
        : null;

      resolve(pageData);
    } else {
      resolve(null);
    }
  });

  return promise;
};

const getLambdaListing = (url) => {
  let fullurl = `https://befu6t64v5.execute-api.us-east-1.amazonaws.com/dev/getBiz`;
  let promise = new Promise(async (resolve, reject) => {
    let pageData = {};

    let res = null;
    try {
      res = await await axios.post(fullurl, { url: url });
    } catch (err) {
      console.log(err);
      console.log(`error fetching: ${fullurl}`);
    }

    if (res) {
      resolve(res.data.message);
    } else {
      resolve(null);
    }
  });

  return promise;
};

const pauseExecution = (base) => {
  let promise = new Promise((resolve, reject) => {
    //pause for random amount of time
    let pauseTime = Math.random() * 100 + base;
    setTimeout(() => {
      resolve(true);
    }, pauseTime);
  });

  return promise;
};

const updateListing = (listing, pageData) => {
  let promise = new Promise(async (resolve, reject) => {
    let keys = Object.keys(pageData);
    keys.forEach((key) => {
      listing[key] = pageData[key];
    });

    listing.listingPageScraped = true;
    listing.save();
    resolve(true);
  });
  return promise;
};

const states = {
  AL: "alabama",
  AK: "alaska",
  AZ: "arizona",
  AR: "arkansas",
  CA: "california",
  CO: "colorado",
  CT: "connecticut",
  DE: "delaware",
  FL: "florida",
  GA: "georgia",
  HI: "hawaii",
  ID: "idaho",
  IL: "illinois",
  IN: "indiana",
  IA: "iowa",
  KS: "kansas",
  KY: "kentucky",
  LA: "louisiana",
  ME: "maine",
  MD: "maryland",
  MA: "massachusetts",
  MI: "michigan",
  MN: "minnesota",
  MS: "mississippi",
  MO: "missouri",
  MT: "montana",
  NE: "nebraska",
  NV: "nevada",
  NH: "new-hampshire",
  NJ: "new-jersey",
  NM: "new-mexico",
  NY: "new-york",
  NC: "north-carolina",
  ND: "north-dakota",
  OH: "ohio",
  OK: "oklahoma",
  OR: "oregon",
  PA: "pennsylvania",
  RI: "rhode-island",
  SC: "south-carolina",
  SD: "south-dakota",
  TN: "tennessee",
  TX: "texas",
  UT: "utah",
  VT: "vermont",
  VA: "virginia",
  WA: "washington",
  WV: "west-virginia",
  WI: "wisconsin",
  WY: "wyoming",
};
