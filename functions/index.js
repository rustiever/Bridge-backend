const functions = require("firebase-functions");
// const admin = require("firebase-admin");
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const fileMiddleware = require('express-multipart-file-parser');


// const db = require("./app");
// const middleware = require("./middleware");
// const authRouter = require("./routes/login");
// const signoutRouter = require("./routes/logout");

const facultyLoginRouter = require('./faculty/routes/login');
const facultyLogoutRouter = require('./faculty/routes/logout');
const facultyUploadRouter = require('./faculty/routes/uploader');

const studentLoginRouter = require('./student/routes/login');
const studentlogoutRouter = require('./student/routes/logout');
const studentRegisterRouter = require('./student/routes/register');

// const app = express();
const faculty = express();
const student = express();

// app.use(cors({ origin: true }));
// app.use(parser.json());

faculty.use(cors({ origin: true }));
faculty.use(parser.json());
faculty.use(fileMiddleware);

student.use(cors({ origin: true }));
student.use(parser.json());

//Faculties Api call section
faculty.use('/api/login', facultyLoginRouter);
faculty.use('/api/logout', facultyLogoutRouter);
faculty.use('/api/upload', facultyUploadRouter);

student.use('/api/register', studentRegisterRouter);
student.use('/api/login', studentLoginRouter);
student.use('/api/logout', studentlogoutRouter);

// app.use("/api/auth", authRouter);
// app.use("/api/logout", signoutRouter);

// app.post("/api/posts", middleware.requestHandler, (req, res) => {
//   (async () => {
//     try {
//       await db.collection("posts").add({
//         caption: req.body.caption,
//         imgUrl: req.body.imgUrl,
//         mode: req.body.mode,
//         ownerId: req.body.ownerId,
//         postOwnerName: req.body.postOwnerName,
//         postOwnerPhotoUrl: req.body.postOwnerPhotoUrl,
//         time: req.body.time,
//       });

//       return res.status(200).send("done with adding");
//     } catch (err) {
//       return res
//         .status(500)
//         .send("No  Access to the resources" + err.toString());
//      }
//   })();
// });

exports.faculty = functions.https.onRequest(faculty);
exports.student = functions.https.onRequest(student);