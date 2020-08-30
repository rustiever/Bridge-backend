const postRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

postRouter.post('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        if (!req.userValidData.posts.includes(req.body.postId)) {
            return res.status(404).send("Not AUthorized");
        }
        const docRef = db.collection('feeds').doc(req.body.postId);

        if (!(await docRef.get()).exists) {
            let err = new Error('No Post is specified');
            return res.status(404).send(err.message);
        }

        const done = await docRef.collection('comments').get();
        if (done.empty) {
            await docRef.delete();
            await db.collection('users').doc(req.uid).update({ posts: firebase.firestore.FieldValue.arrayRemove(req.body.postId) });
            return res.status(200).send('Done');
        }

        done.forEach(val => {
            val.ref.delete();
        });
        await docRef.delete();
        await db.collection('users').doc(req.uid).update({ posts: firebase.firestore.FieldValue.arrayRemove(req.body.postId) });

        return res.status(200).send('Done');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = postRouter;