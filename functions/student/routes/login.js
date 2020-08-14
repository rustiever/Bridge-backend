const express = require('express');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');
const secret = require('../auth/stuconfig');

const studentRouter = express.Router();
studentRouter.use(parser.json());

studentRouter.post('/',middleware.validateToken,middleware.checkId, async(req, res, next) => {
    try {
        const docRef = db.collection('users').doc(req.uid);
        const jsonwebtoken = await jwt.sign({id:req.uid},req.body.token);
        await docRef.update({
            token : firebase.firestore.FieldValue.arrayUnion(jsonwebtoken)
        });
        let result = await docRef.get();
        secret.secret(req.body.token);
        var obj = {};
        obj.authorizeToken = jsonwebtoken;
        obj.userData= result.data();
        return res.status(200).send(obj);
    } catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = studentRouter;