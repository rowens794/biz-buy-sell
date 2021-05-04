const Listing = require("../models/Listing");

exports.display = async (req, res) => {
  res.send("getting state listings");
  let listings = await Listing.find({}, "state listingPageScraped").lean();
  let data = {};
  let totalScraped = 0;

  for (let i = 0; i < listings.length; i++) {
    let listing = listings[i];
    let state = listing.state;
    let scraped = listing.listingPageScraped;

    if (data[state]) {
      data[state].businessCount += 1;
      if (scraped) {
        data[state].scrapeCount += 1;
        totalScraped += 1;
      }
    } else {
      data[state] = {
        businessCount: 1,
        scrapeCount: 0,
      };
      if (scraped) {
        data[state].scrapeCount += 1;
        totalScraped += 1;
      }
    }
  }
  console.log(data);
  console.log(`${totalScraped} of ${listings.length}`);

  console.log("done");
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
