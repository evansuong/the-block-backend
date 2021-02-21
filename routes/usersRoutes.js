// Require
const express = require("express");
const router = express.Router();

const UsersAPI = require("../model/Users");

// not sure what this does
router.use(
  express.urlencoded({
    extended: true,
  })
);
router.use(express.json());


router.get("/login/:username,:password", async (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  if (!username || !password) {
    res.status(400).send("Request has missing fields");
    return ;
  } else {
    try {
      const response = await UsersAPI.UsersAPI.login(username, password);
      res.status(200).json(response);
    } catch (err) {
      res.status(400).send("An error occurred: ${err}");
    }
  }
});


module.exports = router;