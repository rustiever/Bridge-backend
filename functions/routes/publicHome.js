const anonymousRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../auth/app');

anonymousRouter.post('/', async (req, res) => {
    try {

        //Change the limit value according to Your Requirement...
        const limit = 2;
        let docsRef;
        let lasttime;
        var result = {};
        var obj = [];

        const collectionRef = db.collection('feeds');

        if (!req.body.time) {
            docsRef = await collectionRef.where('scope', '==', false).orderBy('timeStamp', 'desc').limit(limit).get();
        } else {
            let time = new firebase.firestore.Timestamp(req.body.time.seconds, req.body.time.nanoseconds);
            docsRef = await collectionRef.where('scope', '==', false).orderBy('timeStamp', 'desc').startAfter(time).limit(limit).get();
        }

        if (docsRef.empty) {
            return res.status(204).send('No content');
        }
        let last = docsRef.docs[docsRef.docs.length - 1];

        if (docsRef.docs.length < limit)
            lasttime = null;
        else
            lasttime = last.data().timeStamp;

        docsRef.forEach(doc => {
            var data = doc.data();
            obj.push({
                postId: doc.id,
                caption: data.caption,
                likes: (data.likes).length,
                photoUrl: data.photoUrl,
                ownerName: data.ownerName,
                ownerPhotoUrl: data.ownerPhotoUrl,
                ownerUid: data.ownerUid,
                timeStamp: data.timeStamp,
                scope: data.scope,
                comments: data.comlen
            });
        });
        //Give the object name as feedData in the result...
        result.feedData = obj;
        return res.status(200).json({
            lastTime: lasttime,
            feedData: result
        });
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = anonymousRouter;
