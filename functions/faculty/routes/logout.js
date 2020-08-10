const express = require('express');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');
const firebase = require('firebase');

const db = require('../../app');
const secret = require('../auth/facconfig');
const middleware = require('../auth/middleware');

const facultyRouter = express.Router();
facultyRouter.use(parser.json());

facultyRouter.get('/', middleware.checkToken, middleware.authorizeToken, async(req, res, next) => {
    try {
        const docRef = await db.collection('faculties').doc(req.uid);
        await docRef.update({
                "token" : firebase.firestore.FieldValue.arrayRemove(req.token)
        });
        return res.status(200).send('Done');
    } catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = facultyRouter;