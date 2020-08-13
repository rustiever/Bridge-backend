const express = require('express');
const parser = require('body-parser');
const firebase = require('firebase');

const db = require('../../app');
const secret = require('../auth/stuconfig');
const middleware = require('../auth/middleware');

const studentRouter = express.Router();
studentRouter.use(parser.json());

studentRouter.get('/', middleware.checkToken, middleware.authorizeToken, async(req, res, next) => {
    try {
        const docRef = await db.collection('users').doc(req.uid);
        await docRef.update({
                "token" : firebase.firestore.FieldValue.arrayRemove(req.token)
        });
        return res.status(200).send('Done');
    } catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = studentRouter;