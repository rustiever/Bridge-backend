const postRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../app');
const secret = require('../auth/facconfig');
const middleware = require('../auth/middleware');

postRouter.post('/', middleware.checkToken, middleware.authorizeToken, async (req, res, next) => {
    try{
        var obj = {};
        if(req.body.caption){
            obj.caption = req.body.caption.toString();
        }
        if(req.body.photoUrl){
            obj.photoUrl = req.body.photoUrl.toString();
        }
        obj.ownerUid = req.uid;
        obj.ownerName = req.body.ownerName;
        obj.ownerPhotoUrl = req.body.ownerPhotoUrl;
        obj.likes = [];

        //obj.comments = null;
        obj.comments = 10;

        //For now I set to global scope of each post...
        obj.scope = 'global';
        obj.timeStamp = firebase.firestore.Timestamp.now();
        const docRef = await db.collection('posts').doc();
        await docRef.set(obj);
        return res.status(200).json({postId : docRef.id});
    }
    catch(err){
        return res.send(err);
    }
});

module.exports = postRouter;