const registerRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');
const secret = require('../auth/facconfig');

registerRouter.post('/', middleware.validateUser, middleware.findUser, middleware.addUser, async (req, res, next) => {
    try{
        const jsonwebtoken = await jwt.sign({id:req.uid, user : 'faculties'}, secret.AuthSecret(req.uid));
        req.userData.token = [ jsonwebtoken ];

        const docRef = db.collection('faculties').doc(req.uid);
        await docRef.set(req.userData);
        
        let result = await docRef.get();
        
        var obj = {};
        var finalData = {};
        var userData = result.data();

        finalData.uid = req.uid;
        finalData.name = userData.name;
        finalData.email = userData.email;
        finalData.photoUrl = userData.photoURL;
        finalData.phone = userData.phone;
        finalData.facultyId = userData.facultyId;
        finalData.branch = userData.branch;

        obj.userData = finalData;
        obj.authorizeToken = jsonwebtoken;

        return res.status(201).json(obj);
    }catch(err){
        return res.send(err);
    }
});

module.exports = registerRouter;