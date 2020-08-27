const registerRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');
const secret = require('../../auth/config');

registerRouter.post('/', middleware.validateUser, middleware.findUser, middleware.addUser, async (req, res) => {
    try {
        let usrtyp;
        if (req.body.usertype === 101) usrtyp = 'faculty';
        else if (req.body.usertype === 202) usrtyp = 'student';
        else usrtyp = 'alumni';
        
        req.userData.usertype = usrtyp;

        const jsonwebtoken = await jwt.sign({ id: req.uid, user: usrtyp }, secret.AuthSecret(req.uid));
        req.userData.token = [jsonwebtoken];

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

        return res.status(201).json(obj);
    } catch (err) {
        return res.send(err);
    }
});

module.exports = registerRouter;