const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const CleanListing = require("../models/CleanListing");

exports.createSheet = async (req, res) => {
  res.send("creating sheet");
  let listings = await CleanListing.find({}).lean();
  // let listings = await Listing.find({});
  let header = createHeader(listings[0]);

  const csvWriter = createCsvWriter({
    path: "./listings.csv",
    header: header,
  });
  csvWriter.writeRecords(listings).then(() => console.log("The CSV file was written successfully"));
};

const createHeader = (listing) => {
  let keys = Object.keys(listing);
  let header = [];
  keys.forEach((key) => {
    header.push({ id: key, title: key });
  });

  return header;
};
