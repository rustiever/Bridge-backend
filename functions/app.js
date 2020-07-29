const firebase = require('firebase');

const firebaseConfig = require('./config');

firebase.initializeApp(firebaseConfig.firebaseConfig);
module.exports = firebase.firestore();
