const firebase = require('firebase');

const firebaseConfig = require('./auth/config');

firebase.initializeApp(firebaseConfig.firebaseConfig);

module.exports = firebase.firestore();