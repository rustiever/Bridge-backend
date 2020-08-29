const functions = require("firebase-functions");
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");


//Routers Section...
//Auth Section...
const userRegister = require('./routes/auth/register');
const userLogin = require('./routes/auth/login');
const userLogout = require('./routes/auth/logout');

//POST FEED Section...
const feedsRouter = require('./routes/post/feeds');
const likeRouter = require('./routes/post/like');
const commentRouter = require('./routes/post/comment');
const getCommentsRouter = require('./routes/post/getComments');
const saveRouter = require('./routes/post/bookmark');
const editCommentRouter = require('./routes/post/editComment');
const deleteCommentRouter = require('./routes/post/deleteComment');
// const userDetailsRouter = require('./routes/userdetails');
const doPostRouter = require('./routes/post/post');
const deletePostRouter = require('./routes/post/delPost');

//Anonymous API Routers...
const anonymousRouter = require('./routes/publicHome');


//EXPRESS APPs Section...
const anonymous = express();
const auth = express();
const postFeed = express();

//Middleware Section...
//For Anonymous User
anonymous.use(cors({ origin: true }));
anonymous.use(parser.json());

//For Authorization APIs
auth.use(cors({ origin: true }));
auth.use(parser.json());

//For Feed APIs
postFeed.use(cors({ origin: true }));
postFeed.use(parser.json());


//Anonymous Users API call section...
anonymous.use('/home', anonymousRouter);


//Auth Section...
auth.use('/register', userRegister);
auth.use('/login', userLogin);
auth.use('/logout', userLogout);


//Post Feeds...
postFeed.use('/feeds', feedsRouter);
postFeed.use('/like', likeRouter);
postFeed.use('/comment', commentRouter);
postFeed.use('/getComments', getCommentsRouter);
postFeed.use('/bookmark', saveRouter);
postFeed.use('/editComment', editCommentRouter);
postFeed.use('/deleteComment', deleteCommentRouter);
postFeed.use('/post', doPostRouter);
postFeed.use('/deletePost', deletePostRouter);

// postFeed.use('/userDetails', userDetailsRouter);

//Cloud Functions Section...
exports.anonymous = functions.https.onRequest(anonymous);
exports.auth = functions.https.onRequest(auth);
exports.home = functions.https.onRequest(postFeed);
