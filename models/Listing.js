const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: { type: String },
  price: { type: String },
  location: { type: String },
  state: { type: String },
  desc: { type: String },
  link: { type: String },
  date: { type: Date },
  listingPageScraped: { type: Boolean },
  cashFlow: { type: String },
  price: { type: String },
  grossRevenue: { type: String },
  ebitda: { type: String },
  ffe: { type: String },
  inventory: { type: String },
  established: { type: String },
  rent: { type: String },
  location: { type: String },
  inventory2: { type: String },
  realEstate: { type: String },
  realEstate2: { type: String },
  buildingSF: { type: String },
  leaseExpiration: { type: String },
  ffe2: { type: String },
  facilities: { type: String },
  competition: { type: String },
  growth: { type: String },
  financing: { type: String },
  supportTraining: { type: String },
  sellingReason: { type: String },
  homeBased: { type: String },
  franchise: { type: String },
  website: { type: String },
  adLine: { type: String },
  businessDescription: { type: String },
  broker: { type: String },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
