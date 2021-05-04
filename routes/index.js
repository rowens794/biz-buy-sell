var express = require("express");
var router = express.Router();

const { getStateListings } = require("../controllers/getStateListings");
const { getListings } = require("../controllers/getListingData");
const { presentListings } = require("../controllers/presentListings");
const { searchListings } = require("../controllers/getSearchListings");
const { cleanListings } = require("../controllers/createCleanListings");
const { createSheet } = require("../controllers/buildSpreadsheet");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET state data. */
router.get("/state", function (req, res, next) {
  getStateListings(req, res);
});

/* GET page data. */
router.get("/singleListings/:state", function (req, res, next) {
  getListings(req, res);
});

/* GET page data. */
router.get("/presentListings", function (req, res, next) {
  presentListings(req, res);
});

/* GET page data. */
router.get("/textSearch", function (req, res, next) {
  searchListings(req, res);
});

/* GET page data. */
router.get("/cleanListings", function (req, res, next) {
  cleanListings(req, res);
});

/* GET page data. */
router.get("/createSheet", function (req, res, next) {
  createSheet(req, res);
});

module.exports = router;
