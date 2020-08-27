const anonymousRouter = require('express').Router();

const db = require('../auth/app');

anonymousRouter.get('/', async ( _req, res) => {
    try {
        const collectionRef = db.collection('feeds');
        const docsRef = await collectionRef.where('scope', '==', false).orderBy('timeStamp','desc').limit(10).get();
        if (docsRef.empty) {
            return res.status(204).end('No data found');
        }
        var result = {};
        var obj = [];
        docsRef.forEach(doc => {
            var d = doc.data();
            obj.push({
                postId: doc.id,
                caption: d.caption,
                likes: (d.likes).length,
                photoUrl: d.photoUrl,
                ownerName: d.ownerName,
                ownerPhotoUrl: d.ownerPhotoUrl,
                ownerUid: d.ownerUid,
                timeStamp: d.timeStamp.seconds,
                comments: (d.comments).length
            });
        });
        //Give the object name as feedData in the result...
        result.feedData = obj;
        return res.status(200).json(result);
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = anonymousRouter;
