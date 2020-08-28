const getCommentRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

getCommentRouter.post('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        const docRef = db.collection('feeds').doc(req.body.postId);
        const resData = await docRef.get();

        if (!resData.exists) {
            return res.status(204).send('No post data available');
        }
        let commentData = [];

        const commentRef = await docRef.collection('comments').orderBy('time', 'desc').limit(20).get();

        if (commentRef.empty) {
            return res.status(200).send('No comments are available');
        }

        commentRef.forEach(element => {
            let data = element.data();
            var obj = {};

            obj.id = element.id;
            obj.time = data.time;
            obj.data = data.data;
            obj.usertype = data.usertype;
            obj.userId = data.UserId;
            obj.edited = data.edited;

            if (data.userId === req.uid) obj.name = 'You';
            else obj.name = data.username;

            commentData.push(obj);
        });
        // commentData.sort((a, b) => (a.time.seconds < b.time.seconds && a.time.nanoseconds < b.time.nanoseconds) ? 1 : ((b.time.seconds < a.time.seconds) ? -1 : 0));

        return res.status(200).send(commentData);
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = getCommentRouter;
