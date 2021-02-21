var firebase = require("../firebase/config");
require("firebase/firestore");
require("firebase/storage");

// Firestore
const db = firebase.firestore();
// TOP LEVEL COLLECTIONS
const users = db.collection("users");

// Storage
const storage = firebase.storage();
const storageRef = storage.ref();

const UsersAPI = {

    // verifies user
    login: async function (username, password) {
        // Get the credentials
        var user = await users.where("username", "==", username);
        user = await user.where("password", "==", password).get();
        
        // check if the query returned no user
        if (user.empty) {
          return { "login": 0 };
        } else {
          return { "login": 1 };
        }

    }
}

// Export the module
module.exports = { UsersAPI };