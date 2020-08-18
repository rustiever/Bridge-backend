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

//Anonymous API Routers...
const anonymousRouter = require('./routes/publicHome');
const facultyDetailsRouter = require('./routes/facultyDetails');

//Faculty API Routers...
const facultyLoginRouter = require('./faculty/routes/login');
const facultyLogoutRouter = require('./faculty/routes/logout');
const facultyUploadRouter = require('./faculty/routes/uploader');
const facultyPostRouter = require('./faculty/routes/post');
const facultyLikeRouter = require('./faculty/routes/like');
const facultySaveRouter = require('./faculty/routes/bookmark');

//Student API Routers..
const studentLoginRouter = require('./student/routes/login');
const studentlogoutRouter = require('./student/routes/logout');
const studentRegisterRouter = require('./student/routes/register');

// const app = express();
const faculty = express();
const student = express();
const anonymous = express();

// app.use(cors({ origin: true }));
// app.use(parser.json());

faculty.use(cors({ origin: true }));
faculty.use(parser.json());
faculty.use(fileMiddleware);

student.use(cors({ origin: true }));
student.use(parser.json());

anonymous.use(cors({ origin: true }));
anonymous.use(parser.json());

//Anonymous Users API call section...
anonymous.use('/home', anonymousRouter);
//anonymous.use('/api/faculties', facultyDetailsRouter);

//Faculties API call section..
faculty.use('/login', facultyLoginRouter);
faculty.use('/logout', facultyLogoutRouter);
faculty.use('/upload', facultyUploadRouter);
faculty.use('/post', facultyPostRouter);
faculty.use('/like', facultyLikeRouter);
faculty.use('/bookmark', facultySaveRouter);

//Student API call section...
student.use('/register', studentRegisterRouter);
student.use('/login', studentLoginRouter);
student.use('/logout', studentlogoutRouter);

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
exports.anonymous = functions.https.onRequest(anonymous);