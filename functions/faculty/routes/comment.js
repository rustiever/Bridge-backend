const commentRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');

commentRouter.put('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async ( req, res, next) => {
    try {
        if(!req.body.name || !req.body.data){
            let err = new Error('Invalid Body');
            return res.status(400).send(err.toString());
        }
        const docRef = await db.collection('posts').doc(req.body.postId);
        if(!(await docRef.get()).exists){
            return res.status(204).send('No post data available');
        }
        var obj = {};
        obj.data = req.body.data;
        obj.userId = req.uid;
        obj.username = req.body.name;
        obj.usertype = req.usertype;

        var resObj = {};
        const valId = firebase.firestore.Timestamp.now();

        resObj[valId] = obj;
        
        await docRef.update({
            comments : firebase.firestore.FieldValue.arrayUnion(resObj)
        });
        return res.status(200).send((await docRef.get()).data().comments);
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = commentRouter;