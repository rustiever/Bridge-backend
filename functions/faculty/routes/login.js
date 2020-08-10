const express = require('express');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');
const secret = require('../auth/config');

const facultyRouter = express.Router();
facultyRouter.use(parser.json());

facultyRouter.post('/',middleware.requestHandler, middleware.requestUser, async(req, res, next) => {
    try {
        if(!req.alreadySignin){
            const uid = req.uid;
            var obj = {
                email : req.body.email,
                photo : req.body.photoUrl,
                name : req.body.name,
                phone : Number(req.body.phone),
                branchName : req.branchName,
                facultyId : req.facultyId
            }
            let jsonwebtoken = await jwt.sign({id:req.uid},req.body.token);
            secret.secret(req.body.token);
            //console.log(secret.AuthSecret());
            obj.token = [jsonwebtoken];
            const docRef = await db.collection('faculties').doc(uid);
            await docRef.set(obj);
            const result = await (await docRef.get()).data();
            return res.status(201).send(result);

        }

        const docRef = await db.collection('faculties').doc(req.uid);
        if(docRef){
            var jsonwebtoken = await jwt.sign({id : req.uid}, req.body.token);
            await docRef.update({
                token : firebase.firestore.FieldValue.arrayUnion(jsonwebtoken)
            });
            let result = await docRef.get();
            secret.secret(req.body.token);
            //console.log(secret.AuthSecret());
            return res.status(200).send(result.data());
        }
        
        return res.status(400).send('Invalid Credentials');

    } catch (err) {
        return res.send(err);
    }
});

module.exports = facultyRouter;