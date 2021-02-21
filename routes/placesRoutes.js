const express = require("express");
const router = express.Router();
const cors = require("cors");
const { RestaurantsAPI } = require("../model/Restaurants");

router.use(
  express.urlencoded({
    extended: true,
  })
);
router.use(express.json());
router.use(cors());

router.get("/:city", async (req, res) => {
  console.log("city: ", req.params.city);
  let city = req.params.city;
  city = "restaurants+in+" + city;
  let response = await RestaurantsAPI.searchRestaurants(city, "");
  let places = [];
  Promise.all(response).then((rev) => {
    res.status(200).json(rev);
  });
});



module.exports = router;