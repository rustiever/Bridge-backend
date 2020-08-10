const express = require('express');
const parser = require('body-parser');
const jwt = require('jsonwebtoken');
const firebase = require('firebase');

const db = require('../../app');
const secret = require('../auth/config');

const facultyRouter = express.Router();
facultyRouter.use(parser.json());

facultyRouter.get('/', async(req, res, next) => {
    return res.send('done');
});

module.exports = facultyRouter;