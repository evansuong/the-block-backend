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
            return { login: 0 };
        } else {
            return { login: 1 };
        }
    },
    // verifies user
    signup: async function (uid, username, password, home_city) {
        // Get the credentials
        var user = await users.where("username", "==", username);

        if (user.exists) {
            console.log("username " + username + " is already taken!");
            return { signup: 0 };
        } else {
            const user = {
                username: username,
                password: password,
                home_city: home_city,
            };

            await users
                .doc(uid)
                .set(user)
                .then(() => {
                    console.log(`User created with ID ${uid}`);
                })
                .catch((error) => {
                    console.log(`Error adding user: ${error}`);
                    return { signup: 0 };
                });

            return { signup: 1 };
        }
    },

    getUsername: async function (username) {
        // Get the document id for the user with username
        const user = await users.where("username", "==", username);

        if (userId.exists) {
            return { uid: user.doc(uid) };
        } else {
            console.log("Can't find current user!");
            return { uid: 0 };
        }
    },

    getUserProfile: async function (uid) {
        // get the doc for the target user
        const userDocRef = await users.doc(uid);
        var userProfile;

        // access document
        await userDocRef
            .get()
            .then(function (userDoc) {
                if (userDoc.exists) {
                    userProfile = {
                        home_city: userDoc.get("home_city"),
                        password: userDoc.get("password"),
                        username: userDoc.get("username"),
                    };
                } else {
                    // no data under uid
                    console.log("Users 111: user is null");
                    userProfile = null;
                }
            })
            .catch(function (error) {
                console.log("Error getting document: ", error);
                userProfile = null;
            });
        return userProfile;
    },
};

// Export the module
module.exports = { UsersAPI };
