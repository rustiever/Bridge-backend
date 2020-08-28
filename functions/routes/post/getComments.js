const getCommentRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

getCommentRouter.post('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res, next) => {
    try {
        const docRef = await db.collection('feeds').doc(req.body.postId);
        const resData = await docRef.get();

        if (!resData.exists) {
            return res.status(204).send('No post data available');
        }

        const commentRef = await docRef.collection('comments').get();
        let commentData = [];

        commentRef.forEach(element => {
            let data = element.data().comment;
            data.forEach(ele => {
                var obj = {};

                obj.time = ele.time;
                obj.data = ele.data;
                obj.usertype = ele.usertype;
                obj.userId = element.id;
                obj.edited = ele.edited;

                if (element.id === req.uid) obj.name = 'You';
                else obj.name = ele.username;

                commentData.push(obj);
            });
        });
        commentData.sort((a, b) => (a.time.seconds < b.time.seconds && a.time.nanoseconds < b.time.nanoseconds) ? 1 : ((b.time.seconds < a.time.seconds) ? -1 : 0));

        return res.status(200).send(commentData);
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = getCommentRouter;