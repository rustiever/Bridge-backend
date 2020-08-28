const commentRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

commentRouter.put('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        if (!req.body.commentId || !req.body.data) {
            let err = new Error('Invalid Body');
            return res.status(400).send(err.toString());
        }

        const docRef = await db.collection('feeds').doc(req.body.postId);
        if (!(await docRef.get()).exists) {
            return res.status(204).send('No post data available');
        }

        const commentRef = await docRef.collection('comments').doc(req.uid);
        const commentData = await commentRef.get();

        if (!commentData.exists) {
            return res.status(204).send('No comment data available');
        }

        let comments = commentData.data().comment;

        let com = comments.find(x => x.time.seconds === req.body.commentId.seconds && x.time.nanoseconds === req.body.commentId.nanoseconds);
        com.data = req.body.data;
        com.edited = true;
        
        await commentRef.update({
            comment: comments
        });

        return res.status(200).send('done');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = commentRouter;