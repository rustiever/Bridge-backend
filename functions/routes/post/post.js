const postRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

postRouter.post('/', middleware.checkToken, middleware.authorizeToken, async (req, res) => {
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
        obj.comlen = 0;
        obj.scope = req.body.scope;
        obj.usertype = req.usertype;
        obj.timeStamp = firebase.firestore.Timestamp.now();

        const docRef = db.collection('feeds').doc();
        await docRef.set(obj);

        await db.collection('users').doc(req.uid).update({ posts: firebase.firestore.FieldValue.arrayUnion(docRef.id) });

        return res.status(200).json({ postId: docRef.id });
    }
    catch (err) {
        return res.send(err.toString());
    }
});

module.exports = postRouter;