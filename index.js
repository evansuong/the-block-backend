require("firebase/firestore");
require("firebase/storage");

const express = require("express");
var app = express(); // Express();
const port = 3000;
const fetch = require("node-fetch");
const server = "localhost:3000";

// Import
const Reviews = require("./model/Reviews.js");
const Users = require("./model/Users.js");

const users = require("./routes/usersRoutes");

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

    return Promise.all(revs).then((rev) => {
        return { reviews: rev };
    });
}

// THIS IS HOW THE FRONTEND WILL CALL
// async function itWorks() {
//     // const user = await Users.UsersAPI.login("tyus", "1234");
//     // console.log("user login call returns: ", user);

//     const reviews = await testGetReviews();
//     console.log("testGetReviews call returns: " + reviews.reviews[0].author);
// }

// itWorks();

// console.log("usersAPI call returns: " + JSON.parse(Users.UsersAPI.login("tysu", "1234")));

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

const username = "tysu";
const password = "1234";

// fetch(`${server}/login/${username},${password}`)
//     .then(res => res.json())
//     .then(data => console.log(data));

// app.get("/")

app.use("/users", users)

app.get(`${server}/users/login/${username},${password}`, (req, res) => {
    // res.send("Hello World");
    console.log(req.json());
});

app.listen(port, () => console.log("listening on port" + port));
