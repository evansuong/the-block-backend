const { create } = require("domain");
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

// HELPER FUNCTIONS
// Generate UUID Function
// function create_UUID() {
//     var dt = new Date().getTime();
//     var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
//         /[xy]/g,
//         function (c) {
//             var r = (dt + Math.random() * 16) % 16 | 0;
//             dt = Math.floor(dt / 16);
//             return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
//         }
//     );
//     return uuid;
// }

function slowFunction(ref) {
    return new Promise((resolve, reject) => {
        db.doc(ref)
            .get()
            .then((curr_review) => {
                // Retrieve fields of the review from the database
                // Get author
                curr_author = curr_review.data().author;
                // Get rating
                curr_rating = curr_review.data().rating;
                // Get review
                curr_review_desc = curr_review.data().review;

                // Create a json object for each review
                review_json = {
                    author: curr_author,
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
    // HELPER
    // uploadBase64Array: async function (base64Array, imageName) {
    //     let downloadURLArrays = [];
    //     // Edge check
    //     if (base64Array.length == 0) {
    //       return downloadURLArrays;
    //     }

    //     // Traverse through base64 strings
    //     // console.log(base64Array.length);
    //     for (let i = 0; i < base64Array.length; i++) {
    //       let baseString = base64Array[i];
    //       // Get only the data of the base64
    //       baseString = baseString.substr(baseString.indexOf(",") + 1);

    //       // Path to image is: hug_images/[topLevelHug.id]/Timestamp in milliseconds[i]
    //       // Where "i" is the ith string in the base64Array
    //       let path = `${imageName}-${i}.jpg`;
    //       // console.log(path);
    //       const hugImageRef = storageRef.child(path);

    //       //convert base64 to buffer / blob
    //       const blob = Buffer.from(baseString, "base64");

    //       // MIME Metadata
    //       let metadata = {
    //         contentType: "image/jpeg",
    //       };

    //       // Upload to firestore
    //       await hugImageRef.put(blob, metadata).then((snapshot) => {
    //         console.log("Success!");
    //       });

    //       // Add to array
    //       downloadURLArrays.push(await hugImageRef.getDownloadURL());
    //     }

    //     console.log(downloadURLArrays);

    //     return downloadURLArrays;
    //   },

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

    // REDACTED base64: array of base 64
    createReview: async function (username, placeId, rating, review) {
        // // Generate UUID
        // var image_uuid = await create_UUID();
        // // Create an image path
        // var imageName = `review_images/${username}/${image_uuid}`;
        // // upload base 64 image
        // var imageDownloadURLSArray = await this.uploadBase64Array(base64, imageName);

        // Create a new review with auto ID
        var rev = reviews.doc();
        await rev.set({
            author: username,
            rating: rating,
            review: review,
        });
        const rev_id = rev.id;
        const rev_ref_str = `reviews/${rev_id}`;

        const restaurant = await restaurants
            .where("place_id", "==", placeId)
            .get();
        //console.log(restaurant.docs[0]);
        // If this restaurant is in our database, add the review
        // and update the avg_rating
        if (!restaurant.empty) {
            const doc = restaurant.docs[0];
            var tot_rating = doc.data().avg_rating * doc.data().num_reviews;
            tot_rating += rating;
            const new_num_reviews = doc.data().num_reviews + 1;
            const new_avg_rating = tot_rating / new_num_reviews;
            const curr_reviews = doc.data().reviews;
            curr_reviews.push(`reviews/${rev_id}`);
            restaurants.doc(restaurant.docs[0].id).update({
                avg_rating: new_avg_rating,
                num_reviews: new_num_reviews,
                reviews: curr_reviews,
            });
        }
        // If this restaurant is NOT in our database, create a restaurant doc
        // and add the review
        else {
            const new_restaurant = restaurants.doc();
            await new_restaurant.set({
                avg_rating: rating,
                num_reviews: 1,
                place_id: placeId,
                reviews: rev_ref_str,
            });
        }
        return { out: rev_id };
    },
};

// Export the module
module.exports = { ReviewsAPI };
