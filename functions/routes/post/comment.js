const commentRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

commentRouter.put('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        if (!req.body.name || !req.body.data) {
            let err = new Error('Invalid Body');
            return res.status(400).send(err.toString());
        }
        const docRef = await db.collection('feeds').doc(req.body.postId);
        if (!(await docRef.get()).exists) {
            return res.status(204).send('No post data available');
        }
        var obj = {};
        obj.data = req.body.data;
        obj.userId = req.uid;
        obj.username = req.body.name;
        obj.usertype = req.usertype;
        obj.time = firebase.firestore.Timestamp.now();

        await docRef.update({
            comments: firebase.firestore.FieldValue.arrayUnion(obj)
        });
        
        return res.status(200).send('done');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = commentRouter;