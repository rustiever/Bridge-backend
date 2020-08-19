const functions = require("firebase-functions");
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const fileMiddleware = require('express-multipart-file-parser');


//Anonymous API Routers...
const anonymousRouter = require('./routes/publicHome');
const facultyDetailsRouter = require('./routes/facultyDetails');


//Faculty API Routers...
const facultyRegisterRouter = require('./faculty/routes/register');
const facultyLoginRouter = require('./faculty/routes/login');
const facultyLogoutRouter = require('./faculty/routes/logout');
const facultyUploadRouter = require('./faculty/routes/uploader');
const facultyPostRouter = require('./faculty/routes/post');
const facultyLikeRouter = require('./faculty/routes/like');
const facultySaveRouter = require('./faculty/routes/bookmark');
const facultyCommentRouter = require('./faculty/routes/comment');


//Student API Routers..
const studentLoginRouter = require('./student/routes/login');
const studentlogoutRouter = require('./student/routes/logout');
const studentRegisterRouter = require('./student/routes/register');
const studentLikeRouter = require('./student/routes/like');
const studentSaveRouter = require('./student/routes/bookmark');
const studentCommentRouter = require('./student/routes/comment');


//EXPRESS APPs Section...
const faculty = express();
const student = express();
const anonymous = express();


//Middlewares for EXPRESS-APP Section...
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
faculty.use('/register', facultyRegisterRouter);
faculty.use('/login', facultyLoginRouter);
faculty.use('/logout', facultyLogoutRouter);
faculty.use('/upload', facultyUploadRouter);
faculty.use('/post', facultyPostRouter);
faculty.use('/like', facultyLikeRouter);
faculty.use('/bookmark', facultySaveRouter);
faculty.use('/comment', facultyCommentRouter);


//Student API call section...
student.use('/register', studentRegisterRouter);
student.use('/login', studentLoginRouter);
student.use('/logout', studentlogoutRouter);
student.use('/like', studentLikeRouter);
student.use('/bookmark', studentSaveRouter);
student.use('/comment', studentCommentRouter);


//Cloud Functions Section...
exports.faculty = functions.https.onRequest(faculty);
exports.student = functions.https.onRequest(student);
exports.anonymous = functions.https.onRequest(anonymous);