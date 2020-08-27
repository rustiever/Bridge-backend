const functions = require("firebase-functions");
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const fileMiddleware = require('express-multipart-file-parser');


//Auth Section...
const userRegister = require('./routes/register');
const userLogin = require('./routes/login');
const userLogout = require('./routes/logout');


//POST FEED Section...
const likeRouter = require('./routes/post/like');

//Anonymous API Routers...
const anonymousRouter = require('./routes/publicHome');
//const facultyDetailsRouter = require('./routes/facultyDetails');
//n8wUfwuJEkjCoDT7B3mp

//Faculty API Routers...
// const facultyHomeRouter = require('./faculty/routes/home');
// const facultyProfileRouter = require('./faculty/routes/profile');
// const facultyUploadRouter = require('./faculty/routes/uploader');
// const facultyPostRouter = require('./faculty/routes/post');
// const facultyLikeRouter = require('./faculty/routes/like');
// const facultySaveRouter = require('./faculty/routes/bookmark');
// const facultyCommentRouter = require('./faculty/routes/comment');
// const facultyGetCommentRouter = require('./faculty/routes/getComments');


//Student API Routers..
// const studentHomeRouter = require('./student/routes/home');
// const studentLikeRouter = require('./student/routes/like');
// const studentSaveRouter = require('./student/routes/bookmark');
// const studentCommentRouter = require('./student/routes/comment');
// const studentGetCommentRouter = require('./student/routes/getComments');


//EXPRESS APPs Section...
// const faculty = express();
// const student = express();
const anonymous = express();
const auth = express();
const postFeed = express();


//Middlewares for EXPRESS-APP Section...
// faculty.use(cors({ origin: true }));
// faculty.use(parser.json());
// faculty.use(fileMiddleware);

// student.use(cors({ origin: true }));
// student.use(parser.json());

anonymous.use(cors({ origin: true }));
anonymous.use(parser.json());

auth.use(cors({ origin: true }));
auth.use(parser.json());

postFeed.use(cors({ origin: true }));
postFeed.use(parser.json());


//Anonymous Users API call section...
anonymous.use('/home', anonymousRouter);


//Auth Section...
auth.use('/register', userRegister);
auth.use('/login', userLogin);
auth.use('/logout', userLogout);
//anonymous.use('/api/faculties', facultyDetailsRouter);

//Post Feeds...
postFeed.use('/like', likeRouter);


//Faculties API call section..
// faculty.use('/home', facultyHomeRouter);
// faculty.use('/profile', facultyProfileRouter);
// faculty.use('/upload', facultyUploadRouter);
// faculty.use('/post', facultyPostRouter);
// faculty.use('/like', facultyLikeRouter);
// faculty.use('/bookmark', facultySaveRouter);
// faculty.use('/comment', facultyCommentRouter);
// faculty.use('/getComments', facultyGetCommentRouter);


//Student API call section...
// student.use('/home', studentHomeRouter);
// student.use('/like', studentLikeRouter);
// student.use('/bookmark', studentSaveRouter);
// student.use('/comment', studentCommentRouter);
// student.use('/getComments', studentGetCommentRouter);


//Cloud Functions Section...
// exports.faculty = functions.https.onRequest(faculty);
// exports.student = functions.https.onRequest(student);
exports.anonymous = functions.https.onRequest(anonymous);
exports.auth = functions.https.onRequest(auth);
exports.postFeed = functions.https.onRequest(postFeed);