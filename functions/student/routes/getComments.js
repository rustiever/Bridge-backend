const getCommentRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');

getCommentRouter.post('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        const docRef = await db.collection('posts').doc(req.body.postId);
        const resData = await docRef.get()
        if(!resData.exists){
            return res.status(204).send('No post data available');
        }

        const comments = resData.data().comments;
        let commentData = [];
        comments.forEach(element => {
            var obj = {};
            obj.time = element.time;
            obj.data = element.data;
            obj.usertype = element.usertype;
            if(element.userId === req.uid) obj.name = 'You';
            else obj.name = element.username;
            commentData.push(obj);
        });

        commentData.sort((a,b) => (a.time.seconds < b.time.seconds && a.time.nanoseconds < b.time.nanoseconds) ? 1 : ((b.time.seconds < a.time.seconds) ? -1 : 0));

        return res.status(200).send(commentData);
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = getCommentRouter;
