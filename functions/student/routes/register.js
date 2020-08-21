const registerRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const parser = require('body-parser');
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');
const secret = require('../auth/stuconfig');

registerRouter.use(parser.json());

registerRouter.post('/', middleware.validateUser, middleware.findUser, middleware.addUser, async (req, res, next) => {
    try{
        const jsonwebtoken = await jwt.sign({ id : req.uid, user : 'users'}, secret.AuthSecret());
        req.userData.token = [ jsonwebtoken ];
        const docRef = db.collection('users').doc(req.uid);
        await docRef.set(req.userData);
        let result = await docRef.get();

        var obj = {};
        var finalData = {};
        var userData = result.data();

        finalData.uid = req.uid;
        finalData.name = userData.name;
        finalData.email = userData.email;
        finalData.photoUrl = userData.photoURL;
        finalData.usn = userData.usn;
        finalData.branch = userData.branch;
        finalData.batch = userData.batch;

        obj.userData = finalData;
        obj.authorizeToken = jsonwebtoken;

        return res.status(201).send(obj);
    }catch(err){
        return res.send(err);
    }
});


module.exports = registerRouter;