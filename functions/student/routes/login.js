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
        const jsonwebtoken = await jwt.sign({id:req.uid, user : 'users'},secret.AuthSecret());
        await docRef.update({
            token : firebase.firestore.FieldValue.arrayUnion(jsonwebtoken)
        });
        let result = await docRef.get();

        var obj = {};
        var finalData = {};
        var userData = result.data();

        finalData.uid = req.uid;
        finalData.name = userData.name;
        finalData.email = userData.email;
        finalData.photoUrl = userData.photoURL;
        finalData.phone = userData.phone;       
        finalData.usn = userData.usn;
        finalData.branch = userData.branch;
        finalData.batch = userData.batch;

        obj.userData = finalData;
        obj.authorizeToken = jsonwebtoken;

        return res.status(200).send(obj);
    } catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = studentRouter;