// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// The Block Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAIhiPvfSCCmtoxJ4eFuCaWeW3onqe6Lkk",
    authDomain: "the-block-305405.firebaseapp.com",
    databaseURL: "https://the-block-305405-default-rtdb.firebaseio.com",
    projectId: "the-block-305405",
    storageBucket: "the-block-305405.appspot.com",
    messagingSenderId: "282980670602",
    appId: "1:282980670602:web:374eeb0d501c0a9e152173",
    measurementId: "G-XNXZKJCSTB",
};

module.exports = firebase.initializeApp(firebaseConfig);
