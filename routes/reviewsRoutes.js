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


// POST endpoint
router.post("/", async (req, res) => {
  console.log('review post request received');
  console.log('request body: ', req.body);

  //let postStatus = post reviews

  try {
    res.status(200).json(postStatus);
  } catch (err) {
    res.status(400).send(`An error occurred: ${err}`);
  }
});

router.get("/:place", async(req, res) => {

  console.log("place: ", req.params.place);

  // let reviews = get reviews by city

  try {
    res.status(200).json('reviews');
  } catch (err) {
    res.status(400).send(`An error occurred: ${err}`);
  }
})




module.exports = router;



// GET endpoint