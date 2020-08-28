const commentRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

commentRouter.put('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        if (!req.body.commentId) {
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
        let len = comments.length;

        if (len === 0) {
            await commentRef.delete();
            return res.status(204).send('No comment data available');
        }
        else if (len === 1) {
            await commentRef.delete();
        }
        else {

            let com = comments.find(x => x.time.seconds === req.body.commentId.seconds && x.time.nanoseconds === req.body.commentId.nanoseconds);
            const index = comments.indexOf(com);

            if (index > -1)
                comments.splice(index, 1);
            else
                return res.status(204).send('No comment data available');

            await commentRef.update({
                comment: comments
            });
        }

        return res.status(200).send('done');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = commentRouter;