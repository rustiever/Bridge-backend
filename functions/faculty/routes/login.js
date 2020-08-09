const express = require('express');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');

const db = require('../../app');
const middleware = require('../auth/middleware');

const facultyRouter = express.Router();

facultyRouter.use(parser.json());

facultyRouter.post('/login',middleware.requestHandler, middleware.requestUser, async(req, res, next) => {
    try {
        if(!req.alreadyLogin){
            const uid = req.uid;
            const email = req.body.email;
            const photo = req.body.photoUrl;
            const name = req.body.name;
            return res.status(200).send('done');

        }
        return res.status(200).send('done');
    } catch (error) {
        return res.send(err);
    }
});

module.exports = facultyRouter;