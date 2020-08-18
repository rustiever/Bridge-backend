const express = require('express');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');
const secret = require('../auth/facconfig');

const facultyRouter = express.Router();
facultyRouter.use(parser.json());

facultyRouter.post('/',middleware.validateToken,middleware.checkId, async(req, res, next) => {
    try {
        const docRef = db.collection('faculties').doc(req.uid);
        const jsonwebtoken = await jwt.sign({ id : req.uid, user : 'faculties'}, req.body.token);
        await docRef.update({
            token : firebase.firestore.FieldValue.arrayUnion(jsonwebtoken)
        });

        let result = await docRef.get();
        secret.secret(req.body.token);

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

        return res.status(200).send(obj);
    } catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = facultyRouter;
