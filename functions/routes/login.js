const express = require('express');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');
const firebase = require('firebase');

const db = require('../auth/app');
const middleware = require('../auth/authorization');
const secret = require('../auth/config');

const facultyRouter = express.Router();
facultyRouter.use(parser.json());

facultyRouter.post('/', middleware.validateToken, middleware.checkId, async (req, res) => {
    try {
        let usrtyp;
        if (req.body.usertype === 101) usrtyp = 'faculty';
        else if (req.body.usertype === 202) usrtyp = 'student';
        else usrtyp = 'alumni';

        const docRef = db.collection('users').doc(req.uid);
        const jsonwebtoken = await jwt.sign({ id: req.uid, user: usrtyp }, secret.AuthSecret(req.uid));
        await docRef.update({
            token: firebase.firestore.FieldValue.arrayUnion(jsonwebtoken)
        });

        let result = await docRef.get();

        var obj = {};
        var finalData = {};
        var userData = result.data();

        finalData.uid = req.uid;
        finalData.name = userData.name;
        finalData.email = userData.email;
        finalData.photoUrl = userData.photoURL;
        finalData.branch = userData.branch;

        if (req.body.usertype === 101) {
            finalData.phone = userData.phone;
            finalData.facultyId = userData.facultyId;
        }
        else if (req.body.usertype === 202) {
            finalData.usn = userData.usn;
            finalData.batch = userData.batch;
        }
        else {
            //Alumni User...
        }

        obj.userData = finalData;
        obj.authorizeToken = jsonwebtoken;

        return res.status(200).send(obj);
    } catch (err) {
        return res.status(400).send(err.toString());
    }
});

module.exports = facultyRouter;