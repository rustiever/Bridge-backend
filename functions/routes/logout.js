const express = require('express');
const parser = require('body-parser');
const firebase = require('firebase');

const db = require('../auth/app');
const middleware = require('../auth/authorization');

const facultyRouter = express.Router();
facultyRouter.use(parser.json());

facultyRouter.put('/', middleware.checkToken, middleware.authorizeToken, async ( req, res) => {
    try {
        const docRef = await db.collection('users').doc(req.uid);
        await docRef.update({
            "token": firebase.firestore.FieldValue.arrayRemove(req.token)
        });
        return res.status(200).send('Done');
    } catch (err) {
        return res.status(400).send(err.toString());
    }
});

module.exports = facultyRouter;