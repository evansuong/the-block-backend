const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(
  express.urlencoded({
    extended: true,
  })
);
router.use(express.json());
router.use(cors());

router.get("/:city", async (req, res) => {
  console.log("city: ", req.params.city);

  // let places = get places function
  try {
    res.status(200).json(places);
  } catch (err) {
    res.status(400).send(`An error occurred: ${err}`);
  }
});



module.exports = router;