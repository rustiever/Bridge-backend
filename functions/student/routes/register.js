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
        const jsonwebtoken = await jwt.sign({id:req.uid, user : 'users'},req.body.token);
        req.userData.token = [ jsonwebtoken ];

        const docRef = db.collection('users').doc(req.uid);
        await docRef.set(req.userData);
        let result = await docRef.get();
        secret.secret(req.body.token);
        
        var obj = {};
        obj.authorizeToken = jsonwebtoken;
        obj.userData = result.data();
        return res.status(201).send(obj);
    }catch(err){
        return res.send(err);
    }
});


module.exports = registerRouter;