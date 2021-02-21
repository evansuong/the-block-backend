var firebase = require("../firebase/config");
require("firebase/firestore");
require("firebase/storage");

// Firestore
const db = firebase.firestore();
// TOP LEVEL COLLECTIONS
const restaurants = db.collection("restaurants");
const users = db.collection("users");
const reviews = db.collection("reviews");

// Storage
const storage = firebase.storage();
const storageRef = storage.ref();

function slowFunction(ref) {
    return new Promise((resolve, reject) => {
        db.doc(ref)
            .get()
            .then((curr_review) => {
                // Retrieve fields of the review from the database
                // Get author
                curr_author = curr_review.data().author;
                // Get list of images
                curr_images = curr_review.data().images;
                // Get rating
                curr_rating = curr_review.data().rating;
                // Get review
                curr_review_desc = curr_review.data().review;

                // Create a json object for each review
                review_json = {
                    author: curr_author,
                    images: curr_images,
                    rating: curr_rating,
                    review: curr_review_desc,
                };

                // Push to the reviews array
                resolve(review_json);
            })
            .catch((error) => {
                console.log("Error getting review: ", error);
            });
    });
}

const ReviewsAPI = {
    // Gets all the reviews for a particular restaurant
    // placeId: the Google Places API
    getReviews: async function (placeId) {
        // Get the restaurant in the database
        var review_refs = [];

        // get the matching restaurant
        const restaurant = await restaurants
            .where("place_id", "==", placeId)
            .get();

        // get all the review references for the restaurant
        review_refs = restaurant.docs[0].data().reviews;

        // console.log("done");
        promises = [];

        for await (ref of review_refs) {
            var promise = slowFunction(ref);
            promises.push(promise);
        }

        return promises;
    },
};

// Export the module
module.exports = { ReviewsAPI };
