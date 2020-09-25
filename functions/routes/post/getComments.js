const getCommentRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

getCommentRouter.post('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        //Set the limit value or number of comments fetching per request...
        const limit = 5;
        let lasttime = null;
        let commentData = [];
        let commentRef;

        const docRef = db.collection('feeds').doc(req.body.postId);
        const resData = await docRef.get();

        if (!resData.exists) {
            return res.status(404).send('No post data available');
        }


        if (!req.body.time) {
            commentRef = await docRef.collection('comments').orderBy('time', 'desc').limit(limit).get();
        } else {
            let time = new firebase.firestore.Timestamp(req.body.time.seconds, req.body.time.nanoseconds);
            commentRef = await docRef.collection('comments').orderBy('time', 'desc').startAfter(time).limit(limit).get();
        }

        if (commentRef.empty) {
            return res.status(200).send({ lastTime: lasttime, commentData: [] });
        }

        let last = commentRef.docs[commentRef.docs.length - 1];

        if (commentRef.docs.length < limit)
            lasttime = null;
        else
            lasttime = last.data().time;

        commentRef.forEach(element => {
            let data = element.data();
            var obj = {};

            obj.id = element.id;
            obj.time = data.time;
            obj.comment = data.comment;
            obj.usertype = data.usertype;
            obj.userId = data.UserId;
            obj.edited = data.edited;
            obj.photoUrl = data.userPhotoUrl;

            if (data.userId === req.uid) obj.name = 'You';
            else obj.name = data.username;

            commentData.push(obj);
        });
        // commentData.sort((a, b) => (a.time.seconds < b.time.seconds && a.time.nanoseconds < b.time.nanoseconds) ? 1 : ((b.time.seconds < a.time.seconds) ? -1 : 0));

        return res.status(200).send({ lastTime: lasttime, commentData: commentData });
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = getCommentRouter;
