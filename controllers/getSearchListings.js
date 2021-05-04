const numeral = require("numeral");
const Listing = require("../models/Listing");

exports.searchListings = async (req, res) => {
  res.send("done");
  const listings = await Listing.aggregate([
    {
      $search: {
        text: {
          query: "daycare",
          path: "desc",
        },
      },
    },
  ]);

  let multiples = getAllMultiples(listings);

  for (let i = 0; i < listings.length; i++) {
    let listing = listings[i];
    let price = numeral(listing.price).value();
    let cashFlow = numeral(listing.cashFlow).value();
    let ebitda = numeral(listing.ebitda).value();
    let realEstate = numeral(listing.realEstate).value();
    let inventory = numeral(listing.inventory).value();
    let ffe = numeral(listing.ffe).value();

    let companyMultiples = getSingleMultiples(listing);
    let hasMultiple = companyMultiples.pToCashFlow || companyMultiples.pToEbitda || companyMultiples.pToGrossRev ? true : false;

    let discEarnings = cashFlow;
    if (!discEarnings) discEarnings = ebitda;

    //estimate loan payments
    let monthlyPayment = PMT(0.06 / 12, 120, -price, 0);
    let priceString = `Price: ${numeral(price).format("$#,#")}`;
    let disEarnings = `Disc Earnings: ${numeral(discEarnings).format("$#,#")}`;
    let loanPayment = `Loan Payments: ${numeral(-monthlyPayment * 12).format("$#,#")}`;
    let annualPayment = monthlyPayment * 12;
    let loanCover = -discEarnings / annualPayment;
    let loanCoverage = `Loan Coverage: ${numeral(loanCover).format("#.#")}x`;

    let rEstate = `Real Estate ${numeral(realEstate).format("$#,#")}`;
    let inv = `Inventory ${numeral(inventory).format("$#,#")}`;
    let FFE = `FF&E ${numeral(ffe).format("$#,#")}`;

    console.log("-----------------------------------");
    console.log(`${priceString} | ${disEarnings} | ${loanPayment} | ${loanCoverage}`);
    console.log(`https://www.bizbuysell.com${listing.link}`);
    console.log(`${rEstate} | ${inv} | ${FFE}`);

    if (companyMultiples.pToCashFlow) console.log(`P/CF: ${companyMultiples.pToCashFlow} vs. ${multiples.pToCashFlow.average}`);
    if (companyMultiples.pToEbitda) console.log(`P/EBITDA: ${companyMultiples.pToEbitda} vs. ${multiples.pToEbitda.average}`);
    if (companyMultiples.pToGrossRev) console.log(`P/Rev: ${companyMultiples.pToGrossRev} vs. ${multiples.pToGrossRev.average}`);
  }

  // console.log(listings);
};

function PMT(ir, np, pv, fv) {
  /*
 ir - interest rate per month
 np - number of periods (months)
 pv - present value
 fv - future value (residual value)
 */
  pmt = (ir * (pv * Math.pow(ir + 1, np) + fv)) / ((ir + 1) * (Math.pow(ir + 1, np) - 1));
  return pmt;
}

const getAllMultiples = (listings) => {
  let pToCashFlow = {
    average: 0,
    min: 0,
    max: 0,
    count: 0,
  };

  let pToEbitda = {
    average: 0,
    min: 0,
    max: 0,
    count: 0,
  };

  let pToGrossRev = {
    average: 0,
    min: 0,
    max: 0,
    count: 0,
  };

  for (let i = 0; i < listings.length; i++) {
    let listing = listings[i];
    let price = numeral(listing.price).value();
    let cashFlow = numeral(listing.cashFlow).value();
    let ebitda = numeral(listing.ebitda).value();
    let grossRevenue = numeral(listing.grossRevenue).value();

    if (price && cashFlow) {
      let pToCF = price / cashFlow;
      pToCashFlow.average += pToCF < 100 && pToCF > 0 ? pToCF : 0;
      pToCashFlow.min = pToCF < 100 && pToCF > 0 && pToCF < pToCashFlow.min ? pToCF : pToCashFlow.min;
      pToCashFlow.max = pToCF < 100 && pToCF > 0 && pToCF > pToCashFlow.max ? pToCF : pToCashFlow.max;
      pToCashFlow.count = pToCF < 100 && pToCF > 0 ? pToCashFlow.count + 1 : pToCashFlow.count;
    }

    if (price && ebitda) {
      let pToEb = price / ebitda;
      pToEbitda.average += pToEb < 100 && pToEb > 0 ? pToEb : 0;
      pToEbitda.min = pToEb < 100 && pToEb > 0 && pToEb < pToEbitda.min ? pToEb : pToEbitda.min;
      pToEbitda.max = pToEb < 100 && pToEb > 0 && pToEb > pToEbitda.max ? pToEb : pToEbitda.max;
      pToEbitda.count = pToEb < 100 && pToEb > 0 ? pToEbitda.count + 1 : pToEbitda.count;
    }

    if (price && grossRevenue) {
      let pToGr = price / grossRevenue;
      pToGrossRev.average += pToGr < 20 && pToGr > 0 ? pToGr : 0;
      pToGrossRev.min = pToGr < 20 && pToGr > 0 && pToGr < pToGrossRev.min ? pToGr : pToGrossRev.min;
      pToGrossRev.max = pToGr < 20 && pToGr > 0 && pToGr > pToGrossRev.max ? pToGr : pToGrossRev.max;
      pToGrossRev.count = pToGr < 20 && pToGr > 0 ? pToGrossRev.count + 1 : pToGrossRev.count;
    }
  }

  pToCashFlow.average = pToCashFlow.average / pToCashFlow.count;
  pToEbitda.average = pToEbitda.average / pToEbitda.count;
  pToGrossRev.average = pToGrossRev.average / pToGrossRev.count;

  pToCashFlow.average = Math.round(pToCashFlow.average * 10) / 10;
  pToCashFlow.min = Math.round(pToCashFlow.min * 10) / 10;
  pToCashFlow.max = Math.round(pToCashFlow.max * 10) / 10;

  pToEbitda.average = Math.round(pToEbitda.average * 10) / 10;
  pToEbitda.min = Math.round(pToEbitda.min * 10) / 10;
  pToEbitda.max = Math.round(pToEbitda.max * 10) / 10;

  pToGrossRev.average = Math.round(pToGrossRev.average * 10) / 10;
  pToGrossRev.min = Math.round(pToGrossRev.min * 10) / 10;
  pToGrossRev.max = Math.round(pToGrossRev.max * 10) / 10;

  return { pToCashFlow, pToEbitda, pToGrossRev };
};

const getSingleMultiples = (listing) => {
  let pToCashFlow = null;
  let pToEbitda = null;
  let pToGrossRev = null;

  let price = numeral(listing.price).value();
  let cashFlow = numeral(listing.cashFlow).value();
  let ebitda = numeral(listing.ebitda).value();
  let grossRevenue = numeral(listing.grossRevenue).value();

  if (price && cashFlow) pToCashFlow = Math.round((price / cashFlow) * 10) / 10;
  if (price && ebitda) pToEbitda = Math.round((price / ebitda) * 10) / 10;
  if (price && grossRevenue) pToGrossRev = Math.round((price / grossRevenue) * 10) / 10;

  return { pToCashFlow, pToEbitda, pToGrossRev };
};
