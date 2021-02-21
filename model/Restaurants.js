var firebase = require("../firebase/config");
require("firebase/firestore");
require("firebase/storage");

// Firestore
const db = firebase.firestore();
// TOP LEVEL COLLECTIONS
const users = db.collection("users");
const restaurants = db.collection("restaurants");
const fetch = require("node-fetch");

// Storage
const storage = firebase.storage();
const storageRef = storage.ref();

// rest is the Places version of restaurant data (a json object)
// restaurant_db is the Firestore version (a DocumentSnapshot obj)
function retrieveRestaurant(rest, restaurant_db) {
    return new Promise((resolve, reject) => {
        // Retrieve fields of the review from the database
        // Get place_id
        curr_place_id = rest.place_id;
        // Get image url
        curr_image = rest.photos[0].photo_reference;
        // Get rating
        curr_rating = restaurant_db.empty
            ? "none"
            : restaurant_db.docs[0].data().avg_rating;
        // Get reviews
        curr_reviews = restaurant_db.empty
            ? "none"
            : restaurant_db.docs[0].data().reviews;
        // Get longitude and latitude
        curr_lng = rest.geometry.location.lng;
        curr_lat = rest.geometry.location.lat;

        // Create a json object for each review
        rest_json = {
            place_id: curr_place_id,
            photo_ref: curr_image,
            avg_rating: curr_rating,
            reviews: curr_reviews,
            longitude: curr_lng,
            latitude: curr_lat,
        };

        resolve(rest_json);
    });
}

// rest_data is a json object
async function jsonifyRestaurants(rest_data) {
    var rests = [];

    // iterate through the results from the target restaurants
    for await (rest of rest_data.results) {
        // try to get the restaurant from our db first
        var restaurant_db = await restaurants
            .where("place_id", "==", rest.place_id)
            .get();

        // if there's nothing, return it w/o ratings or reviews; else just take it
        var promise = retrieveRestaurant(rest, restaurant_db);
        rests.push(promise);
    }

    return rests;
}

const RestaurantsAPI = {
    // return a list of restaurants
    searchRestaurants: async function (query, pagetoken) {
        // replace all spaces with %20's
        query = query.replace(/ /g, "%20");

        // fetch the data
        return fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=AIzaSyAIhiPvfSCCmtoxJ4eFuCaWeW3onqe6Lkk&type=restaurant&pagetoken=${pagetoken}`
        )
            .then((response) => response.json())
            .then((data) => {
                return jsonifyRestaurants(data);
            });
    },
    // return a list of restaurants
    getNextPage: async function (query, pagetoken) {
        // replace all spaces with %20's
        query = query.replace(/ /g, "%20");

        // fetch the data
        return fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=AIzaSyAIhiPvfSCCmtoxJ4eFuCaWeW3onqe6Lkk&type=restaurant&pagetoken=${pagetoken}`
        )
            .then((response) => response.json())
            .then((data) => {
                return data.next_page_token;
            });
    },
};

// Export the module
module.exports = { RestaurantsAPI };
