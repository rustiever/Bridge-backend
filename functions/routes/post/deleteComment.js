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

        const commentRef = await docRef.collection('comments').doc(req.body.commentId);

        if (!(await commentRef.get()).exists) {
            return res.status(200).send('Comment data not available');
        }

        await commentRef.delete();

        let c = (await docRef.collection('comments').get()).size;
        await docRef.update({
            comlen: c
        });

        return res.status(200).send({ comments: c });
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = commentRouter;