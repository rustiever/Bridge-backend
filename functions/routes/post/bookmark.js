const saveRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

saveRouter.put('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res, next) => {
    try {
        const docRef = await db.collection('feeds').doc(req.body.postId);
        let postData = await docRef.get();

        if (!postData.exists) {
            return res.status(204).send('No post data found');
        }

        const userRef = await db.collection('users').doc(req.uid);
        let userData = (await userRef.get()).data().bookmarks;

        if (userData.includes(req.body.postId)) {
            userRef.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(req.body.postId)
            });

            return res.status(200).send('Deleted the Bookmark');
        }

        userRef.update({
            bookmarks: firebase.firestore.FieldValue.arrayUnion(req.body.postId)
        });
        return res.status(200).send('Added the Bookmark');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = saveRouter;