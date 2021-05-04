const mongoose = require("mongoose");

const cleanListingSchema = new mongoose.Schema({
  title: { type: String },
  price: { type: Number },
  location: { type: String },
  state: { type: String },
  desc: { type: String },
  link: { type: String },
  date: { type: Date },
  listingPageScraped: { type: Boolean },
  cashFlow: { type: Number },
  grossRevenue: { type: Number },
  ebitda: { type: Number },
  ffe: { type: Number },
  inventory: { type: Number },
  established: { type: Number },
  rent: { type: Number },
  inventory2: { type: String },
  realEstate: { type: String },
  realEstate2: { type: String },
  buildingSF: { type: Number },
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

  //multiples
  monthlyLoanPayment: { type: Number }, //@6%
  annualLoanPayment: { type: Number },
  loanCoverageRatio: { type: Number },
  discretionaryEarnings: { type: Number },
  pToCashFlow: { type: Number },
  pToEbitda: { type: Number },
  pToGrossRev: { type: Number },
});

const CleanListing = mongoose.model("CleanListing", cleanListingSchema);

module.exports = CleanListing;
