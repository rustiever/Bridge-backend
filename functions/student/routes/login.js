const express = require('express');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');
const firebase = require('firebase');

const db = require('../../app');
const middleware = require('../auth/middleware');
const secret = require('../auth/stuconfig');

const studentRouter = express.Router();
studentRouter.use(parser.json());

studentRouter.post('/', async(req, res, next) => {
    try {
        return res.status(201).send('Done');
    } catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = studentRouter;