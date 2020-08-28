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

        const commentRef = docRef.collection('comments').doc(req.body.commentId);
        const commentData = await commentRef.get();

        if (!commentData.exists) {
            return res.status(204).send('No comment data available');
        }

        let comment = commentData.data();

        if (comment.userId !== req.uid) {
            return res.status(404).send('You have no previlage to edit this comment');
        }

        await commentRef.update({
            edited: true,
            data: req.body.data
        });

        return res.status(200).send('done');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = commentRouter;