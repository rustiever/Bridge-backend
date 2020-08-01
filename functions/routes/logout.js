const express = require('express');
const parser = require('body-parser');
const firebase = require('firebase');

const db = require('../app');
const authorize = require('../auth/authorization');

const signout = express.Router();

signout.use(parser.json());

signout.get('/' , authorize.checkToken , authorize.authorizeToken, (req, res, next) =>{
    (async ()=>{
        try {
            const docRef = await db.collection('users').doc(req.uid);
            await docRef.update({
                "token" : firebase.firestore.FieldValue.arrayRemove(req.token)
            });
            return res.status(201).send('Done!!!LOGOUT successful');
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

module.exports = signout;