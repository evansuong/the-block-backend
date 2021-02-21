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
                console.log("wat on line 22");
                // Retrieve fields of the review from the database
                // Get author
                curr_author = curr_review.data().author;
                // Get list of images
                curr_images = curr_review.data().images;
                // Get rating
                curr_rating = curr_review.data().rating;
                // Get review
                curr_review_desc = curr_review.data().review;
                console.log("wat on line 32");

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

async function populate_reviews(review_refs, reviews) {
    for (const ref of review_refs) {
    }
}

async function test(array) {
    for (var i = 0; i < array.length; i++) {
        console.log(array[i] * 2);
    }
}

const ReviewsAPI = {
    // Gets all the reviews for a particular restaurant
    // placeId: the Google Places API
    getReviews: async function (placeId) {
        // Get the restaurant in the database
        var result = {};
        var reviews = [];
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
        // Promise.all(promises).then((reviews) => {
        //     // var result = { reviews: reviews };
        // });

        // var array = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        // console.log("before: " + array);
        // test(array);
        // console.log("after: " + array);
        // console.log("before: " + reviews);
        // await populate_reviews(review_refs, reviews);
        // console.log("after: " + reviews);
        //------------
        // await restaurants
        //     .where("place_id", "==", placeId)
        //     .get()
        //     .then((querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //             var restaurant_reviews = doc.data().reviews;
        //             console.log("line 28");

        //             restaurant_reviews.forEach((review) => {
        //                 console.log("line 31");
        //                 // The current review document
        //                 curr_review = db
        //                     .doc(review)
        //                     .get()
        //                     .then((curr_review) => {
        //                         console.log("wat on line 37");
        //                         // Retrieve fields of the review from the database
        //                         // Get author
        //                         curr_author = curr_review.data().author;
        //                         // Get list of images
        //                         curr_images = curr_review.data().images;
        //                         // Get rating
        //                         curr_rating = curr_review.data().rating;
        //                         // Get review
        //                         curr_review_desc = curr_review.data().review;
        //                         console.log("wat on line 47");

        //                         // Create a json object for each review
        //                         review_json = {
        //                             author: curr_author,
        //                             images: curr_images,
        //                             rating: curr_rating,
        //                             review: curr_review_desc,
        //                         };

        //                         // Push to the reviews array
        //                         reviews.push(review_json);
        //                         //console.log(reviews);
        //                     })
        //                     .catch((error) => {
        //                         console.log("Error getting review: ", error);
        //                     });
        //             });
        //         });
        //     })
        //     .catch((error) => {
        //         reviews = "none";
        //         console.log("Error getting document: ", error);
        //     });
        // var result = { reviews: reviews };
        // console.log("returning");
        // return result;
    },
};

// Export the module
module.exports = { ReviewsAPI };
