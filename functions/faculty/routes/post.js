const postRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../auth/middleware');

postRouter.post('/', middleware.checkToken, middleware.authorizeToken, async (req, res, next) => {
    try {
        var obj = {};
        if (req.body.caption) {
            obj.caption = req.body.caption.toString();
        }
        if (req.body.photoUrl) {
            obj.photoUrl = req.body.photoUrl.toString();
        }
        obj.ownerUid = req.uid;
        obj.ownerName = req.body.ownerName;
        obj.ownerPhotoUrl = req.body.ownerPhotoUrl;
        obj.likes = [];
        obj.scope = req.body.scope;
        obj.comments = [];
        obj.timeStamp = firebase.firestore.Timestamp.now();
        const docRef = await db.collection('feeds').doc();
        await docRef.set(obj);
        return res.status(200).json({ postId: docRef.id });
    }
    catch (err) {
        return res.send(err.toString());
    }
});

module.exports = postRouter;