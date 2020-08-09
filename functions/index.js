const functions = require("firebase-functions");
// const admin = require("firebase-admin");
const csv = require("csvtojson");
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");

const db = require("./app");
const middleware = require("./middleware");
const authRouter = require("./routes/login");
const signoutRouter = require("./routes/logout");
const facultyRouter = require('./faculty/routes/login');

const app = express();
const faculty = express();

app.use(cors({ origin: true }));
app.use(parser.json());

faculty.use(cors({ origin: true }));
faculty.use(parser.json());

//Faculties Api call section
faculty.use('/api', facultyRouter);

app.use("/api/auth", authRouter);
app.use("/api/logout", signoutRouter);

app.post("/api/posts", middleware.requestHandler, (req, res) => {
  (async () => {
    try {
      await db.collection("posts").add({
        caption: req.body.caption,
        imgUrl: req.body.imgUrl,
        mode: req.body.mode,
        ownerId: req.body.ownerId,
        postOwnerName: req.body.postOwnerName,
        postOwnerPhotoUrl: req.body.postOwnerPhotoUrl,
        time: req.body.time,
      });

      return res.status(200).send("done with adding");
    } catch (err) {
      return res
        .status(500)
        .send("No  Access to the resources" + err.toString());
    }
  })();
});

exports.app = functions.https.onRequest(app);
exports.faculty = functions.https.onRequest(faculty);