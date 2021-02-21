require("firebase/firestore");
require("firebase/storage");

const express = require("express");
var app = express(); // Express();
const port = 3000;
const fetch = require("node-fetch");

// Import
const Reviews = require("./model/Reviews.js");

// GET , PUT, POST, DELETE
function listNamesIds(data) {
    data.forEach((restaurant) => {
        console.log(restaurant.name);
    });
}

// restaurant: Google place API json object for a restaurant
// return -> a list of reviews for that restaurant
async function testGetReviews() {
    var revs = await Reviews.ReviewsAPI.getReviews(
        "ChIJdxxU1WeuEmsR11c4fswX-Io"
    );

    Promise.all(revs).then((rev) => {
        console.log("rev: " + rev);
        return rev;
    });
}
console.log("testGetReviews call returns: " + testGetReviews());

// async function testGetReviews2() {
//     await testGetReviews().then((hello) => {
//         return { reviews: hello };
//     });
// }

// Promise.all([testGetReviews2()]).then((hello) => {
//     console.log("please work " + hello);
// });
// var json_thing = [reviews];
// Promise.all(json_thing).then((final) => {
//     console.log(final);
// });

// console.log(Reviews.ReviewsAPI.getReviews("ChIJdxxU1WeuEmsR11c4fswX-Io"));
// console.log("back to main");

// fetch(
//     "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants%20in%20Sydney&key=AIzaSyAIhiPvfSCCmtoxJ4eFuCaWeW3onqe6Lkk"
// )
//     .then((response) => response.json())
//     .then((data) => listNamesIds(data.results));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => console.log("listening on port" + port));
