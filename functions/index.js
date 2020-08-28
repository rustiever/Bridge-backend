const functions = require("firebase-functions");
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const fileMiddleware = require('express-multipart-file-parser');


//Auth Section...
const userRegister = require('./routes/auth/register');
const userLogin = require('./routes/auth/login');
const userLogout = require('./routes/auth/logout');


//POST FEED Section...
const likeRouter = require('./routes/post/like');
const commentRouter = require('./routes/post/comment');
const getCommentsRouter = require('./routes/post/getComments');
const saveRouter = require('./routes/post/bookmark');
const editCommentRouter = require('./routes/post/editComment');
const deleteCommentRouter = require('./routes/post/deleteComment');


//Anonymous API Routers...
const anonymousRouter = require('./routes/publicHome');
//const facultyDetailsRouter = require('./routes/facultyDetails');
//n8wUfwuJEkjCoDT7B3mp

//Faculty API Routers...
// const facultyHomeRouter = require('./faculty/routes/home');
// const facultyProfileRouter = require('./faculty/routes/profile');
// const facultyUploadRouter = require('./faculty/routes/uploader');
// const facultyPostRouter = require('./faculty/routes/post');



//Student API Routers..
// const studentHomeRouter = require('./student/routes/home');


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
postFeed.use('/comment', commentRouter);
postFeed.use('/getComments', getCommentsRouter);
postFeed.use('/bookmark', saveRouter);
postFeed.use('/editComment', editCommentRouter);
postFeed.use('/deleteComment', deleteCommentRouter);

//Faculties API call section..
// faculty.use('/home', facultyHomeRouter);
// faculty.use('/profile', facultyProfileRouter);
// faculty.use('/upload', facultyUploadRouter);
// faculty.use('/post', facultyPostRouter);


//Student API call section...
// student.use('/home', studentHomeRouter);


//Cloud Functions Section...
// exports.faculty = functions.https.onRequest(faculty);
// exports.student = functions.https.onRequest(student);
exports.anonymous = functions.https.onRequest(anonymous);
exports.auth = functions.https.onRequest(auth);
exports.postFeed = functions.https.onRequest(postFeed);