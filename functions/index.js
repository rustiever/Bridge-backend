const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const serviceAccount = require("./service.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bridge-fd58f.firebaseio.com"
});
const db = admin.firestore();
app.use(cors({ origin: true }));

app.post('/api/posts', (req, res) => {
    (async () => {
        try {
            await db.collection('posts').add({
                caption: req.body.caption,
                imgUrl: req.body.imgUrl,
                mode: req.body.mode,
                ownerId: req.body.ownerId,
                postOwnerName: req.body.postOwnerName,
                postOwnerPhotoUrl: req.body.postOwnerPhotoUrl,
                time: req.body.time
            });
            return res.status(200).send('done with adding');
        }catch (err) {
            console.log(err);
            return re.status(500).send(err);
        }
    })();
});

exports.app = functions.https.onRequest(app);
