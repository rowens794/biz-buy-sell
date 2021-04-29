var express = require("express");
var router = express.Router();

const { getStateListings } = require("../controllers/getStateListings");
const { getListings } = require("../controllers/getListingData");
const { presentListings } = require("../controllers/presentListings");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET state data. */
router.get("/state", function (req, res, next) {
  getStateListings(req, res);
});

/* GET page data. */
router.get("/singleListings", function (req, res, next) {
  getListings(req, res);
});

/* GET page data. */
router.get("/presentListings", function (req, res, next) {
  presentListings(req, res);
});

module.exports = router;
